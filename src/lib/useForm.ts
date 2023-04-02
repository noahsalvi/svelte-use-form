import { setContext } from "svelte";
import { handleChromeAutofill } from "./chromeAutofill";
import { Form, FormControlMissingError } from "./models/form";
import {
  isIgnoredElement,
  isFormControlElement,
  isTextElement,
} from "./models/formControlElement";
import type {
  FormControlElement,
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
 * or handle everything directly in the template
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
export function useForm<
  Keys extends keyof T = "",
  T extends FormProperties = any
>(
  properties: T | FormProperties = {} as FormProperties,
  formName: string = "svelte-use-form"
) {
  const subscribers: Function[] = [];

  let eventListeners: EventListener[] = [];

  let state = Form.create<Keys>(properties, notifyListeners);

  let observer: MutationObserver;

  action.subscribe = subscribe;
  action.set = set;

  // Passing state via context to subcomponents like Hint
  setContext(formName, action);

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
    const inputElements = [
      ...getNodeElementsByTagName<HTMLInputElement>(node, "input"),
    ];
    const textareaElements = [
      ...getNodeElementsByTagName<HTMLTextAreaElement>(node, "textarea"),
    ];
    const selectElements = [
      ...getNodeElementsByTagName<HTMLSelectElement>(node, "select"),
    ];
    const textElements = [...inputElements, ...textareaElements];

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
      if (mutation.type !== "childList") continue;

      // If node gets added
      for (const node of mutation.addedNodes) {
        if (!(isFormControlElement(node) && !isIgnoredElement(node))) continue;
        const initialFormControlProperty = properties[node.name];
        if (!state[node.name] && initialFormControlProperty) {
          state._addControl(
            node.name,
            initialFormControlProperty.initial,
            initialFormControlProperty.validators,
            [], // The setup function will add this node to the form control
            initialFormControlProperty.errorMap
          );
        }
        if (isTextElement(node)) setupTextElements([node]);
        else if (node instanceof HTMLSelectElement) setupSelectElements([node]);
      }

      // If node gets removed
      for (const node of mutation.removedNodes) {
        if (!(node instanceof HTMLElement)) continue; // We only handle HTML elements

        // The observer will only return the direct elements that were removed, and not for example a nested input
        const elements = isFormControlElement(node)
          ? [node]
          : getAllFormControlElements(node);

        elements.forEach((element) => {
          delete state[element.name];
          eventListeners = eventListeners.filter(
            (eventListener) => eventListener.node !== element
          );
        });
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

  // TODO do we still need this?
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
    element: FormControlElement,
    formControl: FormControl
  ) {
    if (formControl.initial) element.value = formControl.initial;
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

  function set(value: typeof state) {
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

/*
  Scan the DOM for a set of form elements by tag name and
  return the elements which are not ignored by `data-suf-ignore` attribute.
*/
function getNodeElementsByTagName<T>(
  node: HTMLFormElement | HTMLElement,
  tagName: string
): T[] {
  return Array.from(node.getElementsByTagName(tagName)).filter(
    (element) => !isIgnoredElement(element)
  ) as T[];
}

function getAllFormControlElements(node: HTMLElement): FormControlElement[] {
  const inputs = getNodeElementsByTagName<HTMLInputElement>(node, "input");
  const textareas = getNodeElementsByTagName<HTMLTextAreaElement>(
    node,
    "textarea"
  );
  const selects = getNodeElementsByTagName<HTMLSelectElement>(node, "select");
  return [...inputs, ...textareas, ...selects];
}
