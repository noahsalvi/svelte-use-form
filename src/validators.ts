export class Validators {
  static required(value: string): Validator {
    return value.trim() ? null : { required: {} };
  }

  static maxLength(length: number) {
    return function (value: string): Validator {
      return value.trim().length >= length ? null : { maxLength: length };
    };
  }

  static minLength(length: number) {
    return function (value: string): Validator {
      return value.trim().length >= length ? null : { minLength: length };
    };
  }

  static email(value: string): Validator {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        value
      )
    ) {
      return null;
    }
    return { email: {} };
  }
}
/** Function that should return null if correct else a object with the key being the name of the error and a truthy value.*/
export type Validator = { [errorName: string]: any };
