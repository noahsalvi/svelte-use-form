export class FormControl {
  private _value: string;
  validators: ((value: string) => boolean)[];
  errors = {};
  initial = "";
  valid = true;
  touched = false;

  get value() {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.validate();
  }

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

  constructor(value: string, validators: []) {
    this.validators = validators;
    this.initial = value;
    this.value = value;
  }
}
