import type { ErrorMap } from "./errorMap";
import type { Validator } from "./validator";

export type FormProperties = {
  [key: string]: {
    /** Initial value of the form control */
    initial?: string;
    /** The validators that will be checked when the input changes */
    validators?: Validator[];
    /**
     * The map through which validation errors will be passed.
     *
     * You can either pass a string or a function returning a new error value
     */
    errorMap?: ErrorMap;
  };
};
