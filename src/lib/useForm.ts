import { setContext } from "svelte";
import { handleChromeAutofill } from "./chromeAutofill";
import { Form, FormControlMissingError } from "./models/form";
import {
  FormControlElement,
  isFormControlElement,
  isTextElement,
  TextElement,
} from "./models/formControlElement";
import { formReferences } from "./stores/formReferences";
import type { FormControl } from "./models/formControl";
import type { FormProperties } from "./models/formProperties";

interface EventListener {
  node: HTMLElement;
  event: string;
  listener: EventListenerOrEventListenerObject;
}
/** Create a new form.
 *
 * You can either pass a default configuration for the form.
 *
 * ----
 * ``` svelte
 * <script>
 *   const form = useForm({
 *     firstName: { initial: "CACHED_NAME", validators: [required, maxLength(10)] }
 *   })
 * </script>
 *
 * <input name="firstName />
 * ```
 * ----
 * or handle everything directly in the form control
 *
 * ----
 *
 * ```svelte
 * <script>
 *   const form = useForm();
 * </script>
 *
 * <input name="firstName" value="CACHED_NAME" use:validators={[required, maxLength(10)]} />
 * ```
 */
export function useForm<Keys extends keyof T, T extends FormProperties = any>(
  properties: T | FormProperties = Object.create(null)
) {
  const eventListeners: EventListener[] = [];
  const subscribers: Function[] = [];

  let state = Form.create<Keys>(properties, notifyListeners);

  let observer: MutationObserver;

  action.subscribe = subscribe;
  action.set = set;

  // Passing state via context to subcomponents like Hint
  setContext("svelte-use-form_form", action);

  /**
   * ### The store and action of a form.
   *
   * Use the `$` prefix to access the state of the form;
   */
  function action(node: HTMLFormElement) {
    // Bootstrap form
    setupForm(node);

    // Add form reference to global internal store
    formReferences.update((values) => [
      ...values,
      { node, form: state, notifyListeners },
    ]);

    return {
      update: () => {},
      destroy: () => {
        unmountEventListeners();
        observer.disconnect();
      },
    };
  }

  function setupForm(node: HTMLFormElement) {
    const inputElements = [...node.getElementsByTagName("input")];
    const textareaElements = [...node.getElementsByTagName("textarea")];
    const textElements = [...inputElements, ...textareaElements];
    const selectElements = [...node.getElementsByTagName("select")];

    setupTextElements(textElements);
    setupSelectElements(selectElements);
    hideNotRepresentedFormControls([...textElements, ...selectElements]);
    setupFormObserver(node);

    notifyListeners();
  }

  function setupTextElements(textElements: TextElement[]) {
    for (const textElement of textElements) {
      const name = textElement.name;
      let formControl = state[name];
      // TextElement doesn't have FormControl yet (TextElement wasn't statically provided)
      if (!formControl) {
        const initial = getInitialValueFromTextElement(textElement);
        state._addControl(name, initial, [], [textElement], {});
        formControl = state[name]!;
      } else {
        formControl.elements.push(textElement);
        if (
          textElement.type === "radio" &&
          textElement instanceof HTMLInputElement &&
          textElement.checked
        ) {
          formControl.initial = textElement.value;
        }
      }

      switch (textElement.type) {
        case "checkbox":
        case "radio":
          mountEventListener(textElement, "click", handleBlurOrClick);
          break;
        default:
          setInitialValue(textElement, formControl!);
          handleAutofill(textElement, formControl!);
          mountEventListener(textElement, "blur", handleBlurOrClick);
      }

      mountEventListener(textElement, "input", handleInput);
    }
  }

  function setupSelectElements(selectElements: HTMLSelectElement[]) {
    for (const selectElement of selectElements) {
      const name = selectElement.name;
      const formControl = state[name];

      if (!formControl) {
        const initial = selectElement.value;
        state._addControl(name, initial, [], [selectElement], {});
      } else {
        formControl.elements.push(selectElement);
        setInitialValue(selectElement, formControl);
      }

      mountEventListener(selectElement, "input", handleInput);
      mountEventListener(selectElement, "input", handleBlurOrClick);
      mountEventListener(selectElement, "blur", handleBlurOrClick);
    }
  }

  function setupFormObserver(form: HTMLFormElement) {
    observer = new MutationObserver(observeForm);
    observer.observe(form, { childList: true, subtree: true });
  }

  function observeForm(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        // If node gets removed
        for (const node of mutation.removedNodes) {
          if (node instanceof HTMLElement) {
            const inputElements = [...node.getElementsByTagName("input")];
            const textareaElements = [...node.getElementsByTagName("textarea")];
            const selects = [...node.getElementsByTagName("select")];
            const elements = [
              ...inputElements,
              ...textareaElements,
              ...selects,
            ];
            if (isFormControlElement(node)) elements.push(node);

            for (const element of elements) {
              for (const eventListener of eventListeners) {
                if (element === eventListener.node) {
                  delete state[element["name"]];

                  element.removeEventListener(
                    eventListener.event,
                    eventListener.listener
                  );
                }
              }
            }
          }
        }

        // If node gets added
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            const inputElements = [...node.getElementsByTagName("input")];
            const textareaElements = [...node.getElementsByTagName("textarea")];
            const textElements = [...inputElements, ...textareaElements];

            const selectElements = [...node.getElementsByTagName("select")];

            if (isTextElement(node)) textElements.push(node);
            else if (node instanceof HTMLSelectElement)
              selectElements.push(node);

            for (const element of [...textElements, ...selectElements]) {
              const initialFormControlProperty = properties[element.name];
              if (!state[element.name] && initialFormControlProperty) {
                state._addControl(
                  element.name,
                  initialFormControlProperty.initial,
                  initialFormControlProperty.validators,
                  [element],
                  initialFormControlProperty.errorMap
                );
              }
            }

            setupTextElements(textElements);
            setupSelectElements(selectElements);
          }
        }
      }
    }

    notifyListeners();
  }

  function mountEventListener(
    node: HTMLElement,
    event: string,
    listener: EventListenerOrEventListenerObject
  ) {
    node.addEventListener(event, listener);
    eventListeners.push({ node, event, listener });
  }

  function unmountEventListeners() {
    for (const { node, event, listener } of eventListeners) {
      node.removeEventListener(event, listener);
    }
  }

  function handleAutofill(textElement: TextElement, formControl: FormControl) {
    // Chrome sometimes fills the input visually without actually writing a value to it, this combats it
    handleChromeAutofill(textElement, formControl, notifyListeners);

    // If the browser writes a value without triggering an event
    function handleNoEventAutofilling() {
      if (textElement.value !== formControl.initial) {
        handleBlurOrClick({ target: textElement } as any);
        return true;
      }
      return false;
    }

    const autofillingWithoutEventInstantly = handleNoEventAutofilling();

    // In a SPA App the form is sometimes not filled instantly so we wait 100ms
    if (!autofillingWithoutEventInstantly)
      setTimeout(() => handleNoEventAutofilling(), 100);
  }

  function handleInput({ target: node }: Event) {
    if (isFormControlElement(node)) {
      const name = node.name;
      const formControl = state[name];
      if (!formControl) throw new FormControlMissingError();

      let value: string;
      if (node.type === "checkbox" && node instanceof HTMLInputElement) {
        value = node.checked ? "checked" : "";
      } else {
        value = node.value;
      }

      formControl.value = value;

      notifyListeners();
    }
  }

  function handleBlurOrClick({ target: node }: Event) {
    if (isFormControlElement(node)) {
      const formControl = state[node.name];
      if (!formControl) throw new FormControlMissingError();

      if (!formControl.touched) handleInput({ target: node } as any);

      formControl.touched = true;
      node.classList.add("touched");

      notifyListeners();
    }
  }

  function hideNotRepresentedFormControls(nodes: FormControlElement[]) {
    for (const key of Object.keys(properties)) {
      let isFormControlRepresentedInDom = false;

      for (const node of nodes) {
        if (key === node.name) isFormControlRepresentedInDom = true;
      }

      if (!isFormControlRepresentedInDom) delete state[key];
    }
  }

  function setInitialValue(
    formElement: FormControlElement,
    formControl: FormControl
  ) {
    if (formControl.initial) formElement.value = formControl.initial;
  }

  function notifyListeners() {
    for (const callback of subscribers) callback(state);
  }

  function subscribe(callback: (form: typeof state) => void) {
    subscribers.push(callback);
    callback(state);

    return { unsubscribe: () => unsubscribe(callback) };
  }

  function unsubscribe(subscriber: Function) {
    const index = subscribers.indexOf(subscriber);
    subscribers.splice(index, 1);
  }

  function set(value) {
    // TODO investigage what happens when different Keys are passed
    state = value;

    notifyListeners();
  }

  return action;
}

function getInitialValueFromTextElement(textElement: TextElement) {
  let initial: string;

  // Handle Radio button initial values
  if (textElement.type === "radio" && textElement instanceof HTMLInputElement) {
    initial = textElement.checked ? textElement.value : "";
  } else if (
    textElement.type === "checkbox" &&
    textElement instanceof HTMLInputElement
  ) {
    initial = textElement.checked ? "checked" : "";
  } else {
    initial = textElement.value;
  }
  return initial;
}
