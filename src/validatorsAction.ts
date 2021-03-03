import { tick } from "svelte";
import { get } from "svelte/store";
import type { FormMember } from "./models/formMembers";
import type { Validator } from "./models/validator";
import { formReferences } from "./stores/formReferences";

/**
 * Add validators to form control
 * ``` svelte
 * <input name="nameOfInput" use:validators={[required, minLength(5), maxLength(20)]} />
 * ```
 */
export function validators(node: FormMember, validators: Validator[]) {
  setupValidation();

  async function setupValidation() {
    const formElement = node.form;
    await tick();
    const formReference = get(formReferences).find(
      (form) => form.node === formElement
    );

    const formControl = formReference.form[node.name];
    formControl.validators.push(...validators);
    formControl.validate();
    formReference.notifyListeners();
  }
}
