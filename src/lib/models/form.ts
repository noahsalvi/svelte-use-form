import { FormControl, type ValueType } from './formControl';
import type { FormControlElement } from "./formControlElement";
import type { FormProperties } from './formProperties';
import type { ErrorMap, Validator } from "./validator";

export class Form<SKeys extends keyof any, MKeys extends keyof any> {
  /**
   * Function for creating a Form
   * @remarks This allows us to specify the index signatures in the class
   */
  static create<SKeys extends keyof any, MKeys extends keyof any>(
    initialData: FormProperties,
    notifyListeners: Function
  ) {
    return new Form<SKeys, MKeys>(initialData, notifyListeners) as Form<SKeys, MKeys> &
      FormControlsSpecifiedSingle<SKeys> &
      FormControlsSpecifiedMultiple<MKeys> &
      FormControlsUnspecified;
  }
  private readonly _notifyListeners: Function;

  get valid(): boolean {
    let valid = true;
    this.forEachControl((formControl) => {
      if (!formControl.valid) valid = false;
    });
    return valid;
  }

  get touched(): boolean {
    let touched = true;
    this.forEachControl((formControl) => {
      if (!formControl.touched) touched = false;
    });
    return touched;
  }

  get values(): FormValues<SKeys, MKeys> {
    let values = {} as any;
    this.forEachControl((formControl, key) => {
      values[key] = formControl.value;
    });

    return values;
  }

  set touched(value: boolean) {
    this.forEachControl((formControl) => {
      formControl.touched = value;
    });

    this._notifyListeners();
  }

  private constructor(initialData: FormProperties, notifyListeners: Function) {
    for (const [k, v] of Object.entries(initialData)) {
      if (v.multiple) {
        this._addControl(k, v.initial || [], true, v.validators, [], v.errorMap);
      } else {
        this._addControl(k, v.initial || '', false, v.validators, [], v.errorMap);
      }
    }

    this._notifyListeners = notifyListeners;
  }

  /** Reset the whole form */
  reset() {
    this.forEachControl((formControl) => formControl.reset());
  }

  /** @internal Add a form conrol to the Form */
  _addControl<T extends ValueType>(
    name: string,
    initial: T | undefined,
    multiple: boolean,
    validators: Validator<T>[] = [],
    elements: FormControlElement[] = [],
    errorMap: ErrorMap = {}
  ) {
    if (multiple) {
      (this as any)[name] = new FormControl<string>({
        value: initial as string || '',
        multiple: multiple,
        validators: validators as Validator<string>[],
        elements: elements,
        errorMap: errorMap,
        formRef: () => this,
      });
    } else {
      (this as any)[name] = new FormControl<string[]>({
        value: initial as string[] || [],
        multiple: multiple,
        validators: validators as Validator<string[]>[],
        elements: elements,
        errorMap: errorMap,
        formRef: () => this,
      });
    }
    const value = initial || (multiple ? [] : "");

  }

  private forEachControl(
    callback: (formControl: FormControl<any>, key: string) => void
  ) {
    for (const [key, value] of Object.entries(this)) {
      if (value instanceof FormControl) {
        callback(value, key);
      }
    }
  }
}

export class FormControlMissingError extends Error {}

// We do not use utility types here, since they would hide the name of the type
export type FormControlsUnspecified = {
  [key: string]: FormControl<string | string[]> | undefined;
};

export type FormControlsSpecifiedSingle<Keys extends keyof any> = {
  [K in Keys]: FormControl<string>;
};

export type FormControlsSpecifiedMultiple<Keys extends keyof any> = {
  [K in Keys]: FormControl<string[]>;
};

export type FormValues<SKeys extends keyof any, MKeys extends keyof any> = Partial<
  Record<string, string>
> &
  Record<SKeys, string> & Record<MKeys, string[]>;
