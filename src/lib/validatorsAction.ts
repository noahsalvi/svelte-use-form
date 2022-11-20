import { tick } from "svelte";
import { get } from "svelte/store";
import { FormControl } from "./models/formControl";
import type { FormControlElement } from "./models/formControlElement";
import type { Validator } from "./models/validator";
import { formReferences } from "./stores/formReferences";

/**
 * Add validators to form control
 * @example
 * ``` svelte
 * <input name="nameOfInput" use:validators={[required, minLength(5), maxLength(20)]} />
 * ```
 */
export function validators(
  element: FormControlElement,
  validators: Validator[]
) {
  setupValidation();

  async function setupValidation() {
    const formElement = element.form;
    if (!formElement)
      throw new ValidatorsActionError(
        "HTML element doesn't have an ancestral form"
      );
    await tick();
    const formReference = get(formReferences).find(
      (form) => form.node === formElement
    );

    if (!formReference)
      throw new ValidatorsActionError(
        "HTML form doesn't have a svelte-use-form binded. (use:form)"
      );

    const formControl = formReference.form[element.name];
    if (!(formControl instanceof FormControl))
      throw new ValidatorsActionError(
        `Form Control [${element.name}] doesn't exist.`
      );
    formControl.validators.push(...validators);
    formControl.validate();
    formReference.notifyListeners();
  }
}

export class ValidatorsActionError extends Error {}
