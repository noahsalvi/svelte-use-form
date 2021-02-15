import type { ValidationErrors, Validator } from "./validators";

/** A FormControl represents the state of a form member like (input, textarea...) */
export class FormControl {
  validators: Validator[];

  /**
   * Returns an object containing possible ValidationErrors
   * ### Example (All validators are throwing an error)
   * `{ required: true, minLength: 4, maxLength: 20 }`
   * ### Example 2 (Only required is not valid)
   * `{ required: true }`
   */
  errors: { [errorName: string]: ValidationErrors } = {};

  /** If the FormControl passed all given validators. */
  valid = true;

  /**
   * If the FormControl has been interacted with.
   * (triggered by blur event)
   */
  touched = false;

  /** The initial value of the FormControl. Defaults to `""` if not set via `useForm(params)`. */
  readonly initial: string;

  private _value: string;

  get value() {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.validate();
  }

  /** Validate the FormControl by querying through the given validators. */
  validate() {
    let valid = true;
    this.errors = {};

    for (const validator of this.validators) {
      const error = validator(this._value);
      if (error) {
        valid = false;
        for (const [k, v] of Object.entries(error)) {
          this.errors[k] = v;
        }
      }
    }

    this.valid = valid;
    return valid;
  }

  constructor(value: string, validators: Validator[]) {
    this.validators = validators;
    this.initial = value;
    this.value = value;
  }
}
