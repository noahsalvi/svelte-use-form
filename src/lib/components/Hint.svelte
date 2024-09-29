<script lang="ts">
  import { getContext } from "svelte";
  import type { Form, FormControlsUnspecified } from "../models/form";

  /**
   * The name of the form control.
   *
   * @remarks Can be omitted when using a wrapping HintGroup setting the `for` property.
   * @example
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
  let name = "";
  export { name as for };
  /** The name of useForm instance */
  export let form: string = "svelte-use-form";
  /** `class` of the underlying html element */
  let _class = "";
  export { _class as class };
  /** `id` of the underlying html element */
  export let id: string | undefined = undefined;
  /** The name of the error that should show this hint */
  export let on = "";
  /** Hides this hint when the given validator is triggered */
  export let hideWhen = "";
  /** Does the same thing as `hideWhen="required"` */
  export let hideWhenRequired = false;
  /** Show the hint even when the field is untouched */
  export let showWhenUntouched = false;

  // Tries to get the name from the parent HintGroup
  if (!name) name = getContext(`${form}_hint-group-name`);

  const formContext: {
    subscribe: (
      callback: (form: Form<any, any> & FormControlsUnspecified) => any
    ) => void;
  } = getContext(form);

  $: touched = $formContext[name]?.touched ?? {};
  $: errors = $formContext[name]?.errors ?? {};
  $: hideWhenError = hideWhen ? errors[hideWhen] : "";
  $: requiredError = errors["required"];
  $: value = errors[on];
</script>

{#if !(hideWhenRequired && requiredError) && !hideWhenError}
  {#if (touched || showWhenUntouched) && value}
    <div {id} class="svelte-use-form-hint {_class}">
      <slot {value} />
    </div>
  {/if}
{/if}
