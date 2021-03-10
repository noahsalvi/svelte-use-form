import type { ErrorMap } from "./errorMap";
import type { Form } from "./form";
import type { ValidationErrors } from "./validationErrors";
import type { Validator } from "./validator";

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
  errors: ValidationErrors = {};

  /**
   * Contains a map of values, that will be shown
   * in place of the original validation error.
   */
  errorMap: ErrorMap = {};

  /** If the FormControl passed all given validators. */
  valid = true;

  /**
   * If the FormControl has been interacted with.
   * (triggered by blur event)
   */
  touched = false;

  /** The initial value of the FormControl. Defaults to `""` if not set via `useForm(params)`. */
  readonly initial: string;

  private readonly formRef: () => Form;

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
      const errors = validator(this._value, this.formRef());

      if (errors) {
        valid = false;
        for (const error of Object.entries(errors)) {
          let [key, value] = error;

          // If there is a map for the error, use it
          const errorMap = this.errorMap[key];
          if (errorMap) {
            value = typeof errorMap === "function" ? errorMap(value) : errorMap;
          }

          this.errors[key] = value;
        }
      }
    }

    this.valid = valid;
    return valid;
  }

  constructor(
    value: string,
    validators: Validator[],
    errorMap: ErrorMap,
    formRef: () => Form
  ) {
    this.formRef = formRef;
    this.validators = validators;
    this.errorMap = errorMap;
    this.initial = value;
    this.value = value;
  }
}
