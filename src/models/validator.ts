import type { Form } from "./form";
import type { ValidationErrors } from "./validationErrors";

/** A function that either returns null when the value is valid and else an `ValidationErrors` object. */
export type Validator = (value: string, form?: Form) => null | ValidationErrors;
