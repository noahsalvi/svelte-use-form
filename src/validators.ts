export class Validators {
  static required(value: string) {
    return value.trim() ? null : { required: true };
  }

  static minLength(length: number) {
    return function (value: string) {
      return value.trim().length >= length ? null : { minLength: length };
    };
  }
}
