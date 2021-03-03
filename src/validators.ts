import type { ValidationErrors } from "./models/validationErrors";

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
