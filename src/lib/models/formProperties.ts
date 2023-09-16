import type { ErrorMap, Validator } from "./validator";
import type { ValueType } from '$lib/models/formControl';

export type FormProperties = {
  [key: string]: {
    /** Initial value of the form control */
    initial?: ValueType;
    /** The validators that will be checked when the input changes */
    validators?: Validator<ValueType>[];
    /**
     * The map through which validation errors will be mapped.
     * You can either pass a string or a function returning a new error value
     *
     * **Think of it as a translation map. 😆**
     */
    errorMap?: ErrorMap;
  };
};
