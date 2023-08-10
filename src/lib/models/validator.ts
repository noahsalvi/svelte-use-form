import type { Form, FormControlsUnspecified } from "./form";
import type { FormControl } from "./formControl";

/** 
 * A function that either returns `null | undefined` when valid or else a {@link ValidationErrors} object. 
 */
export type Validator = (
  value: string,
  form: Form<any> & FormControlsUnspecified,
  /** The control (field) this validator was assigned to. */
  control: FormControl
) => ValidationErrors | (null | undefined);

/** An object that contains errors thrown by the validator. */
export type ValidationErrors = { [errorName: string]: any };

export type ErrorMap = { [errorName: string]: string | ((error: any) => any) };
