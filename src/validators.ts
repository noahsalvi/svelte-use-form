export class Validators {
  static required(value: string): ValidationErrors | null {
    return value.trim() ? null : { required: true };
  }

  static maxLength(length: number) {
    return function (value: string): ValidationErrors | null {
      return value.trim().length <= length ? null : { maxLength: length };
    };
  }

  static minLength(length: number) {
    return function (value: string): ValidationErrors | null {
      return value.trim().length >= length ? null : { minLength: length };
    };
  }

  static email(value: string): ValidationErrors | null {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        value
      )
    ) {
      return null;
    }
    return { email: {} };
  }

  static number(value: string): ValidationErrors | null {
    if (/^[0-9]+$/.test(value)) {
      return null;
    }
    return { number: {} };
  }
}
/** An object that contains errors thrown by the validator. */
export type ValidationErrors = { [errorName: string]: any };
