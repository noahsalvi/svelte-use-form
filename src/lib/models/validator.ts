import type { Form } from "./form";
import type { ValidationErrors } from "./validationErrors";

/** A function that either returns `null | undefined` when the value is valid or else an `ValidationErrors` object. */
export type Validator = (
  value: string,
  form?: Form<any>
) => ValidationErrors | (null | undefined);
