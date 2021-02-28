import { FormControl } from "./formControl";
import type { FormProperties } from "./formProperties";

export class Form {
  [formControlName: string]: FormControl;

  // @ts-expect-error - Due to index signature
  get valid(): boolean {
    let valid = true;
    this.forEachFormControl((formControl) => {
      if (!formControl.valid) valid = false;
    });
    return valid;
  }

  // @ts-expect-error - Due to index signature
  get touched(): boolean {
    let touched = true;
    this.forEachFormControl((formControl) => {
      if (!formControl.touched) touched = false;
    });
    return touched;
  }

  // @ts-expect-error - Due to index signature
  get values(): { [formControlName: string]: string } {
    let values = {};
    this.forEachFormControl((formControl, key) => {
      values[key] = formControl.value;
    });

    return values;
  }

  constructor(initialData: FormProperties) {
    for (const [k, v] of Object.entries(initialData ?? {})) {
      this[k] = new FormControl(v.initial ?? "", v.validators ?? []);
    }
  }

  // @ts-expect-error - Due to index signature
  private forEachFormControl(
    callback: (formControl: FormControl, key?: string) => void
  ) {
    for (const [key, value] of Object.entries(this)) {
      if (value instanceof FormControl) {
        callback(value, key);
      }
    }
  }
}
