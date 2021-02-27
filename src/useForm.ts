import { setContext } from "svelte";
import { handleChromeAutofill } from "./chromeAutofill";
import { Form } from "./form";
import { FormControl } from "./formControl";
import type { Validator } from "./validators";

export interface FormProperties {
  [control: string]: {
    initial?: string;
    validators?: Validator[];
  };
}

interface EventListener {
  node: HTMLElement;
  event: string;
  listener: EventListenerOrEventListenerObject;
}

export type TextElement = HTMLInputElement | HTMLTextAreaElement;
type FormMember = TextElement | HTMLSelectElement;

export function useForm(properties?: FormProperties) {
  const eventListeners: EventListener[] = [];
  const subscribers = [];

  let state: Form = new Form(properties ?? {});
  let observer: MutationObserver;

  function action(node: HTMLFormElement) {
    setupForm(node);

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

    const selects = [...node.getElementsByTagName("select")];

    setupTextElements(textElements);
    setupSelectElements(selects);
    setupFormObserver(node);
    hideNotRepresentedFormControls([...textElements, ...selects]);

    notifyListeners();
  }

  function setupTextElements(textElements: TextElement[]) {
    for (const textElement of textElements) {
      const name = textElement["name"];

      if (!state[name]) {
        state[name] = new FormControl("", []);
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
        state[name] = new FormControl(initial, []);
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
        for (const element of mutation.removedNodes) {
          for (const elementEventListener of eventListeners) {
            if (elementEventListener.node === element) {
              delete state[element["name"]];

              element.removeEventListener(
                elementEventListener.event,
                elementEventListener.listener
              );
            }
          }
        }

        for (const element of mutation.addedNodes) {
          const name = element["name"];
          const initialFormControl = properties[name];

          if (!state[name] && initialFormControl) {
            state[name] = new FormControl(
              initialFormControl.initial ?? "",
              initialFormControl.validators ?? []
            );
          }

          if (
            element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement
          ) {
            setupTextElements([element]);
          } else if (element instanceof HTMLSelectElement) {
            setupSelectElements([element]);
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

  function setInitialValue(formMember: FormMember, formControl: FormControl) {
    if (formControl.initial) formMember.value = formControl.initial;
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
    if (
      node instanceof HTMLInputElement ||
      node instanceof HTMLTextAreaElement ||
      node instanceof HTMLSelectElement
    ) {
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
    if (
      node instanceof HTMLInputElement ||
      node instanceof HTMLTextAreaElement ||
      node instanceof HTMLSelectElement
    ) {
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
