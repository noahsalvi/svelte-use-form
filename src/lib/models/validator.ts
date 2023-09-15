import type { Form, FormControlsUnspecified } from "./form";
import type { FormControl } from "./formControl";

/**
 * A function that depending on the control's validity either returns:
 * - `null | undefined` when **valid**
 * - {@link ValidationErrors} when **invalid**.
 */
export type Validator = (
  /** The value of the control. */
  value: string | string[],
  /** The containing form. */
  form: Form<any> & FormControlsUnspecified,
  /** The control this validator was assigned to. */
  control: FormControl
) => ValidationErrors | (null | undefined);

/** An object that contains errors thrown by the validator. */
export type ValidationErrors = { [errorName: string]: any };

export type ErrorMap = { [errorName: string]: string | ((error: any) => any) };
