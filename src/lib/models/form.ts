import type { ErrorMap } from "./errorMap";
import { FormControl } from "./formControl";
import type { FormElement } from "./formElements";
import type { FormProperties } from "./formProperties";
import type { Validator } from "./validator";

export class Form<Keys extends keyof any> {
  static create<Keys extends keyof any>(
    initialData: FormProperties,
    notifyListeners: Function
  ) {
    return new Form<Keys>(initialData, notifyListeners) as Form<Keys> &
      FormControlsSpecified<Keys> &
      FormControlsUnspecified;
  }
  private readonly _notifyListeners: Function;

  get valid(): boolean {
    let valid = true;
    this.forEachFormControl((formControl) => {
      if (!formControl.valid) valid = false;
    });
    return valid;
  }

  get touched(): boolean {
    let touched = true;
    this.forEachFormControl((formControl) => {
      if (!formControl.touched) touched = false;
    });
    return touched;
  }

  get values(): FormValues<Keys> {
    let values = {} as any;
    this.forEachFormControl((formControl, key) => {
      values[key] = formControl.value;
    });

    return values;
  }

  set touched(value: boolean) {
    this.forEachFormControl((formControl) => {
      formControl.touched = value;
    });

    this._notifyListeners();
  }

  private constructor(initialData: FormProperties, notifyListeners: Function) {
    for (const [k, v] of Object.entries(initialData)) {
      this._addFormControl(k, v.initial, v.validators, [], v.errorMap);
    }

    this._notifyListeners = notifyListeners;
  }

  /** Reset the whole form */
  reset() {
    console.log(this);
    this.forEachFormControl((formControl) => formControl.reset());
  }

  _addFormControl(
    name: string,
    initial: string = "",
    validators: Validator[] = [],
    elements: FormElement[] = [],
    errorMap: ErrorMap = {}
  ) {
    this[name] = new FormControl({
      value: initial,
      validators: validators,
      elements: elements,
      errorMap: errorMap,
      formRef: () => this,
    });
  }

  private forEachFormControl(
    callback: (formControl: FormControl, key: string) => void
  ) {
    for (const [key, value] of Object.entries(this)) {
      if (value instanceof FormControl) {
        callback(value, key);
      }
    }
  }
}

export class FormFormControlMissingError extends Error {}

export type FormControlsUnspecified = {
  [key: string]: FormControl | undefined;
};
export type FormControlsSpecified<Keys extends keyof any> = {
  [K in Keys]: FormControl;
};
export type FormValues<Keys extends keyof any> = Partial<
  Record<string, string>
> &
  Record<Keys, string>;
