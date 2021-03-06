import { writable } from "svelte/store";
import type { Form } from "../models/form";

type FormReference = {
  form: Form;
  node: HTMLFormElement;
  notifyListeners: Function;
};

export const formReferences = writable<FormReference[]>([]);
