import { writable } from "svelte/store";
import type { Form, FormControlsUnspecified } from "../models/form";

export type FormReference = {
  form: Form<any, any> & FormControlsUnspecified;
  node: HTMLFormElement;
  notifyListeners: Function;
};

export const formReferences = writable<FormReference[]>([]);
