import { Form } from "./form";
import { FormControl } from "./formControl";

export function useForm(initialData) {
  let state: Form = new Form(initialData);

  let inputs: HTMLElement[] = [];
  const subscribers = [];

  function action(node: HTMLFormElement) {
    setupReactiveForm(node);

    return {
      detroy() {
        removeEventListenersFromInputElements();
      },
    };
  }

  function setupReactiveForm(node: HTMLFormElement) {
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

      inputElement.addEventListener("input", handleInput);
      inputElement.addEventListener("blur", handleBlur);
      // handleInput({ target: inputElement });
    }
  }

  function handleInput({ target: node }) {
    const name = node["name"];
    const value = node["value"];
    state[name].value = value;
    const valid = state[name].valid;

    if (valid) {
      node.classList.remove("invalid");
    } else {
      node.classList.add("invalid");
    }

    notifyListeners();
  }

  function handleBlur({ target: node }) {
    const name = node["name"];
    state[name].touched = true;
    node.classList.add("touched");

    notifyListeners();
  }

  function removeEventListenersFromInputElements() {
    for (const inputElement of inputs) {
      inputElement.removeEventListener("input", handleInput);
      inputElement.removeEventListener("blur", handleBlur);
    }
  }

  function subscribe(callback: (reactiveForm: Form) => {}) {
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
  return action;
}
