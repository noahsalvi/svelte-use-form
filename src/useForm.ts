import { setContext } from "svelte";
import { handleChromeAutofill } from "./chrome-autofill";
import { Form } from "./form";
import { FormControl } from "./formControl";

export function useForm(initialData) {
  let state: Form = new Form(initialData);

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

  function addListenersToInputElements(inputElements: HTMLElement[]) {
    for (const inputElement of inputElements) {
      const name = inputElement["name"];

      if (!state[name]) {
        state[name] = new FormControl("", []);
      }
      handleChromeAutofill(inputElement, state[name], notifyListeners);
      inputElement.addEventListener("input", handleInput);
      inputElement.addEventListener("blur", handleBlur);
    }
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
