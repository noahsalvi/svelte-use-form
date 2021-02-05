import { FormControl } from "./formControl";

export class Form {
  [control: string]: FormControl;

  get valid(): boolean | any {
    let valid = true;
    for (const [k, v] of Object.entries(this)) {
      if (this[k] instanceof FormControl && !v.valid) {
        valid = false;
      }
    }
    return valid;
  }

  constructor(initialData: { [control: string]: { validators: [] } }) {
    for (const [k, v] of Object.entries(initialData)) {
      this[k] = new FormControl("", v.validators);
    }
  }
}
