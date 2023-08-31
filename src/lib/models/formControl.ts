import type { Form } from "./form";
import type { FormControlElement } from "./formControlElement";
import type { Validator, ValidationErrors, ErrorMap } from "./validator";

/** A FormControl represents the state of a {@link FormControlElement} like (input, textarea...) */
export class FormControl {
  validators: Validator[];

  /**
   * Returns an object containing possible validation errors
   * @example
   * (All validators are throwing an error)
   * `{ required: true, minLength: 4, maxLength: 20 }`
   * (Only required is invalid)
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
  elements: FormControlElement[] = [];

  /** Does the FormControl pass all given validators? */
  valid = true;

  /**
   * If the FormControl has been interacted with.
   * (triggered by blur event)
   */
  _touched = false;

  /** The initial value of the FormControl. Defaults to `""` if not set via `useForm(params)`. */
  initial: string;

  // TODO can we get the Form via Svelte context?
  private readonly formRef: () => Form<any>;

  private _value: string = "";

  get value() {
    return this._value;
  }

  get touched() {
    return this._touched;
  }

  /**
   * This will only change the internal value of the control, not the one displayed in the actual HTML-Element
   *
   * See `change(value: String)` for doing both
   */
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
    elements: FormControlElement[];
    formRef: () => Form<any>;
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
   * @example Backend Response returning Login failed
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
    this.valid = false;

    // Update the $form
    this.formRef()["_notifyListeners"]();
  }

  /** Change the value and the value of all HTML-Elements associated with this control */
  change(value: any) {
    this.value = value;
    this.elements.forEach((element) => (element.value = value));

    // Update the $form
    this.formRef()["_notifyListeners"]();
  }

  /** Validate the FormControl by querying through the given validators. */
  validate() {
    let valid = true;
    this.errors = {};

    for (const validator of this.validators) {
      const errors = validator(this.value, this.formRef() as any, this);
      if (!errors) continue;

      valid = false;
      for (const error of Object.entries(errors)) {
        let [key, value] = error;

        // If there is a map for the error, use it
        const errorMapping = this.errorMap[key];
        if (errorMapping) {
          value =
            typeof errorMapping === "function"
              ? errorMapping(value)
              : errorMapping;
        }

        this.errors[key] = value;
      }
    }

    this.valid = valid;
    this.elements.forEach((element) =>
      element.setCustomValidity(valid ? "" : "Field is invalid")
    );

    return valid;
  }

  /** Reset the form control value to its initial value or `{ value }` and untouch it */
  reset({ value }: { value?: string | null } = {}) {
    const resetValue = value == null ? this.initial : value;
    this.elements.forEach((element) => (element.value = resetValue));
    this.value = resetValue;
    this.touched = false;

    // Updating the $form
    this.formRef()["_notifyListeners"]();
  }
}
