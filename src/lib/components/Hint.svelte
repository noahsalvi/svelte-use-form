<script lang="ts">
  import { getContext } from "svelte";
  import type { Form, FormControlsUnspecified } from "../models/form";

  /**
   * The name of the form control.
   *
   * @remarks Can be omitted when using a wrapping HintGroup setting the `for` property.
   * @exmaple
   * ``` svelte
   * <input name="nameOfFormControl" use:validators={[required]} />
   * <Hint for="nameOfFormControl" on="required">HINT</Hint>
   * ```
   * OR
   * ``` svelte
   * <input name="nameOfFormControl" use:validators={[required]} />
   * <HintGroup for="nameOfFormControl">
   *   <Hint on="required">HINT</Hint>
   * </HintGroup>
   * ```
   */
  export { name as for };

  /** The name of useForm instance */
  export let form: string = "svelte-use-form_form"
  /** The name of the error that should show this hint */
  export let on = "";
  /** Hides this hint when the given validator is triggered */
  export let hideWhen = "";
  /** Does the same thing as `hideWhen="required"` */
  export let hideWhenRequired = false;
  /** Show the hint even when the field is untouched */
  export let showWhenUntouched = false;
  
  let name = "";

  let internalClass = $$props.class;

  // Tries to get the name from the parent HintGroup
  if (!name) name = getContext(`${form}_hint-group-name`);

  const formContext: {
    subscribe: (callback: (form: Form<any> & FormControlsUnspecified) => any) => void;
  } = getContext(form);

  $: touched = $formContext[name]?.touched ?? {};
  $: errors = $formContext[name]?.errors ?? {};
  $: hideWhenError = hideWhen ? errors[hideWhen] : "";
  $: requiredError = errors["required"];
  $: value = errors[on];
</script>

{#if !(hideWhenRequired && requiredError) && !hideWhenError}
  {#if (touched || showWhenUntouched) && value}
    <div class="{form}-hint {internalClass}">
      <slot {value} />
    </div>
  {/if}
{/if}
