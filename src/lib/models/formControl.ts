import type { ErrorMap } from "./errorMap";
import type { Form } from "./form";
import type { FormMember } from "./formMembers";
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

  /**
   * The DOM elements representing this control
   */
  elements: FormMember[] = [];

  /** If the FormControl passed all given validators. */
  valid = true;

  /**
   * If the FormControl has been interacted with.
   * (triggered by blur event)
   */
  _touched = false;

  /** The initial value of the FormControl. Defaults to `""` if not set via `useForm(params)`. */
  initial: string;

  private readonly formRef: () => Form;

  private _value: string;

  get value() {
    return this._value;
  }

  get touched() {
    return this._touched;
  }

  set value(value: string) {
    this._value = value;
    this.validate();
  }

  set touched(value: boolean) {
    this._touched = value;
    this.elements.forEach((element) => {
      if (value) element.classList.add("touched");
      else element.classList.remove("touched");
    });
  }

  constructor(formControl: {
    value: string;
    validators: Validator[];
    errorMap: ErrorMap;
    elements: FormMember[];
    formRef: () => Form;
  }) {
    this.formRef = formControl.formRef;
    this.validators = formControl.validators;
    this.errorMap = formControl.errorMap;
    this.initial = formControl.value;
    this.elements = formControl.elements;
    this.value = formControl.value;
  }

  /**
   * Set an error manually.
   *
   * The error will be removed after changes to the value or on validate()
   *
   * Used for setting an error that would be difficult to implement with a validator.
   * e.g. Backend Response returning Login failed
   * ``` typescript
   * function submit() {
   *    apiLogin($form.values).then(response => {})
   *    .catch(error => {
   *        if (error.status === 403) {
   *            $form.password.error({ login: "Password or username is incorrect" });
   *        }
   *    })
   * }
   * ```
   */
  error(errors: ValidationErrors) {
    this.errors = { ...errors, ...this.errors };

    // Updating the $form
    this.formRef()["_notifyListeners"]();
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
    this.elements.forEach((element) =>
      element.setCustomValidity(valid ? "" : "Field is invalid")
    );

    return valid;
  }

  /** Reset the form control value to its initial value and untouch it */
  reset({ value = null } = {}) {
    const resetValue = value !== null ? value : this.initial;
    this.elements.forEach((element) => (element.value = resetValue));
    this.value = resetValue;
    this.touched = false;

    // Updating the $form
    this.formRef()["_notifyListeners"]();
  }
}
