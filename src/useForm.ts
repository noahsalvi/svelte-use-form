import { setContext } from "svelte";
import { handleChromeAutofill } from "./chromeAutofill";
import { Form } from "./form";
import { FormControl } from "./formControl";
import type { Validator } from "./validators";

export interface FormProperties {
  [control: string]: {
    initial?: string;
    validators: Validator[];
  };
}

export function useForm(properties?: FormProperties) {
  let state: Form = new Form(properties ?? {});

  let inputs: HTMLElement[] = [];
  const subscribers = [];

  function action(node: HTMLFormElement) {
    setupForm(node);

    return {
      update: () => {},
      detroy: () => {
        removeEventListenersFromInputElements();
      },
    };
  }

  function setupForm(node: HTMLFormElement) {
    const inputElements = node.getElementsByTagName("input");
    if (!inputElements) return;
    setupInputElements(inputElements as any);
    inputs.push(...inputElements);

    notifyListeners();
  }

  function setupInputElements(inputElements: HTMLInputElement[]) {
    for (const inputElement of inputElements) {
      const name = inputElement["name"];

      if (!state[name]) {
        state[name] = new FormControl("", []);
      }

      setInitialValue(inputElement, state[name]);
      handleAutofill(inputElement, state[name]);

      inputElement.addEventListener("input", handleInput);
      inputElement.addEventListener("blur", handleBlur);
    }
  }

  function setInitialValue(input: HTMLInputElement, formControl: FormControl) {
    if (formControl.initial) input.value = formControl.initial;
  }

  function handleAutofill(
    inputElement: HTMLInputElement,
    formControl: FormControl
  ) {
    // Chrome sometimes fills the input without actually writing a value to it, this combats it
    handleChromeAutofill(inputElement, formControl, notifyListeners);

    // If the browser writes a value without triggering an event
    function handleNoEventAutofilling() {
      if (inputElement.value !== formControl.initial) {
        handleBlur({ target: inputElement } as any);
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
    if (node instanceof HTMLInputElement) {
      const name = node["name"];
      const value = node["value"];
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

  function handleBlur({ target: node }: Event) {
    if (node instanceof HTMLInputElement) {
      const control = state[node.name];

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

  function notifyListeners() {
    for (const callback of subscribers) callback(state);
  }

  action.subscribe = subscribe;
  action.set = set;

  // Passing state via context to subcomponents like Hint
  setContext("svelte-use-form_form", action);

  return action;
}
