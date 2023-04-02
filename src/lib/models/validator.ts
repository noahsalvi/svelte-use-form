import type { Form, FormControlsUnspecified } from "./form";

/** A function that either returns `null | undefined` when the value is valid or else an `ValidationErrors` object. */
export type Validator = (
  value: string,
  form: Form<any> & FormControlsUnspecified
) => ValidationErrors | (null | undefined);

/** An object that contains errors thrown by the validator. */
export type ValidationErrors = { [errorName: string]: any };

export type ErrorMap = { [errorName: string]: string | ((error: any) => any) };
