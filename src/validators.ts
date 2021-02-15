/** An object that contains errors thrown by the validator. */
export type ValidationErrors = { [errorName: string]: any };

/** A function that either returns null when the value is valid and else an `ValidationErrors` object. */
export type Validator = (value: string) => null | ValidationErrors;

export function required(value: string): null | ValidationErrors {
  return value.trim() ? null : { required: true };
}

export function maxLength(length: number) {
  return function (value: string): null | ValidationErrors {
    return value.trim().length <= length ? null : { maxLength: length };
  };
}

export function minLength(length: number) {
  return function (value: string): null | ValidationErrors {
    return value.trim().length >= length ? null : { minLength: length };
  };
}

export function email(value: string): null | ValidationErrors {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      value
    )
  ) {
    return null;
  }
  return { email: {} };
}

export function number(value: string): null | ValidationErrors {
  if (/^[0-9]+$/.test(value)) {
    return null;
  }
  return { number: {} };
}
