import { setContext } from "svelte";
import { handleChromeAutofill } from "./chromeAutofill";
import { Form } from "./form";
import { FormControl } from "./formControl";

export interface FormProperties {
  [control: string]: { initial?: string; validators: [] };
}

export function useForm(properties: FormProperties) {
  let state: Form = new Form(properties);

  let inputs: HTMLElement[] = [];
  const subscribers = [];

  function action(node: HTMLFormElement) {
    setupForm(node);

    return {
      detroy() {
        removeEventListenersFromInputElements();
      },
    };
  }

  function setupForm(node: HTMLFormElement) {
    const inputElements = node.getElementsByTagName("input");
    if (!inputElements) return;
    addListenersToInputElements(inputElements as any);
    inputs.push(...inputElements);

    notifyListeners();
  }

  function addListenersToInputElements(inputElements: HTMLInputElement[]) {
    for (const inputElement of inputElements) {
      const name = inputElement["name"];

      if (!state[name]) {
        state[name] = new FormControl("", []);
      }

      handleAutofill(inputElement, state[name]);
      inputElement.addEventListener("input", handleInput);
      inputElement.addEventListener("blur", handleBlur);
    }
  }

  function handleAutofill(
    inputElement: HTMLInputElement,
    formControl: FormControl
  ) {
    // Chrome sometimes fills the input without actually writing a value to it, this combats it
    handleChromeAutofill(inputElement, formControl, notifyListeners);

    // If the browser fills the value without triggering a event
    function handleNoEventAutofilling() {
      if (inputElement.value !== formControl.initial) {
        handleBlur({ target: inputElement } as any);
        return true;
      }
      return false;
    }

    const autofillingWithoutEventInstantly = handleNoEventAutofilling();

    // In a SPA App the form is not filled instantly so we wait 100ms
    if (!autofillingWithoutEventInstantly)
      setTimeout(() => handleNoEventAutofilling(), 100);
  }

  function handleInput({ target: node }: Event) {
    if (node instanceof HTMLInputElement) {
      const name = node["name"];
      const value = node["value"];
      state[name].value = value;
      const valid = state[name].valid;

      if (valid) {
        node.setCustomValidity("");
      } else {
        node.setCustomValidity("svelte-use-form-invalid");
      }

      notifyListeners();
    }
  }

  function handleBlur({ target: node }: Event) {
    if (node instanceof HTMLInputElement) {
      const name = node["name"];
      const control = state[name];

      if (!control.touched) handleInput({ target: node } as any);

      control.touched = true;
      node.classList.add("touched");

      notifyListeners();
    }
  }

  function removeEventListenersFromInputElements() {
    for (const inputElement of inputs) {
      inputElement.removeEventListener("input", handleInput);
      inputElement.removeEventListener("blur", handleBlur);
    }
  }

  function subscribe(callback: (form: Form) => {}) {
    subscribers.push(callback);
    callback(state);

    return () => unsubscribe(callback);
  }

  function unsubscribe(subscriber: Function) {
    const index = subscribers.indexOf(subscriber);
    subscribers.splice(index, 1);
  }

  function set(value) {
    state = value;

    notifyListeners();
  }

  function notifyListeners() {
    for (const callback of subscribers) callback(state);
  }

  action.subscribe = subscribe;
  action.set = set;

  // Passing state via context to subcomponents like Hint
  setContext("svelte-use-form_form", action);

  return action;
}
