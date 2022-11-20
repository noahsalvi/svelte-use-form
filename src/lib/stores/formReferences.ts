import { writable } from "svelte/store";
import type { Form, FormControlsUnspecified } from "../models/form";

type FormReference = {
  form: Form<any> & FormControlsUnspecified;
  node: HTMLFormElement;
  notifyListeners: Function;
};

export const formReferences = writable<FormReference[]>([]);
