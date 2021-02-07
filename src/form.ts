import { FormControl } from "./formControl";
import type { FormProperties } from "./useForm";

export class Form {
  [control: string]: FormControl;

  /**Returns boolean */
  get valid(): any {
    let valid = true;
    for (const [k, v] of Object.entries(this)) {
      if (this[k] instanceof FormControl && !v.valid) {
        valid = false;
      }
    }
    return valid;
  }

  /** Returns boolean */
  get touched(): any {
    let touched = true;
    for (const [k, v] of Object.entries(this)) {
      if (this[k] instanceof FormControl && !v.touched) {
        touched = false;
      }
    }
    return touched;
  }

  constructor(initialData: FormProperties) {
    for (const [k, v] of Object.entries(initialData)) {
      this[k] = new FormControl(v.initial ?? "", v.validators);
    }
  }
}
