import { setContext } from "svelte";
import { handleChromeAutofill } from "./chromeAutofill";
import { Form } from "./models/form";
import type { FormControl } from "./models/formControl";

import {
  FormMember,
  isFormMember,
  isTextElement,
  TextElement,
} from "./models/formMembers";
import type { FormProperties } from "./models/formProperties";
import { formReferences } from "./stores/formReferences";

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
export function useForm(properties?: FormProperties) {
  properties = properties ?? {};

  const eventListeners: EventListener[] = [];
  const subscribers = [];

  let state: Form = new Form(properties);
  let observer: MutationObserver;

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
      const name = textElement["name"];

      if (!state[name]) {
        const initial = textElement.value;
        state.addFormControl(name, initial, [], {});
      }

      switch (textElement.type) {
        case "checkbox":
        case "radio":
          mountEventListener(textElement, "click", handleBlurOrClick);
          break;
        default:
          setInitialValue(textElement, state[name]);
          handleAutofill(textElement, state[name]);
          mountEventListener(textElement, "blur", handleBlurOrClick);
      }

      mountEventListener(textElement, "input", handleInput);
    }
  }

  function setupSelectElements(selectElements: HTMLSelectElement[]) {
    for (const selectElement of selectElements) {
      const name = selectElement["name"];

      if (!state[name]) {
        const initial = selectElement.value;
        state.addFormControl(name, initial, [], {});
      } else {
        setInitialValue(selectElement, state[name]);
      }

      mountEventListener(selectElement, "input", handleInput);
      mountEventListener(selectElement, "input", handleBlurOrClick);
      mountEventListener(selectElement, "blur", handleBlurOrClick);
    }
  }

  function setupFormObserver(form: HTMLFormElement) {
    observer = new MutationObserver(observeForm);
    observer.observe(form, { childList: true });
  }

  function observeForm(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
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
            if (isFormMember(node)) elements.push(node);

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
                state.addFormControl(
                  element.name,
                  initialFormControlProperty.initial,
                  initialFormControlProperty.validators,
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
    if (isFormMember(node)) {
      const name = node["name"];
      const value = node[node.type === "checkbox" ? "checked" : "value"];
      state[name].value = value;
      const valid = state[name].valid;

      if (valid) {
        node.setCustomValidity("");
      } else {
        node.setCustomValidity("Field is invalid");
      }

      notifyListeners();
    }
  }

  function handleBlurOrClick({ target: node }: Event) {
    if (isFormMember(node)) {
      const control = state[node.name];

      if (!control.touched) handleInput({ target: node } as any);

      control.touched = true;
      node.classList.add("touched");

      notifyListeners();
    }
  }

  function hideNotRepresentedFormControls(nodes: HTMLElement[]) {
    for (const key of Object.keys(properties)) {
      let isFormControlRepresentedInDom = false;

      for (const node of nodes) {
        if (key === node["name"]) isFormControlRepresentedInDom = true;
      }

      if (!isFormControlRepresentedInDom) delete state[key];
    }
  }

  function setInitialValue(formMember: FormMember, formControl: FormControl) {
    if (formControl.initial) formMember.value = formControl.initial;
  }

  function unmountEventListeners() {
    for (const { node, event, listener } of eventListeners) {
      node.removeEventListener(event, listener);
    }
  }

  function notifyListeners() {
    for (const callback of subscribers) callback(state);
  }

  function subscribe(callback: (form: Form) => void) {
    subscribers.push(callback);
    callback(state);

    return { unsubscribe: () => unsubscribe(callback) };
  }

  function unsubscribe(subscriber: Function) {
    const index = subscribers.indexOf(subscriber);
    subscribers.splice(index, 1);
  }

  function set(value) {
    state = value;

    notifyListeners();
  }

  action.subscribe = subscribe;
  action.set = set;

  // Passing state via context to subcomponents like Hint
  setContext("svelte-use-form_form", action);

  return action;
}
