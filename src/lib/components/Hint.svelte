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
  
  
  /** `class` of the underlying html element */
  
  
  
  
  
  
  interface Props {
    for?: string;
    /** The name of useForm instance */
    form?: string;
    class?: string;
    /** `id` of the underlying html element */
    id?: string | undefined;
    /** The name of the error that should show this hint */
    on?: string;
    /** Hides this hint when the given validator is triggered */
    hideWhen?: string;
    /** Does the same thing as `hideWhen="required"` */
    hideWhenRequired?: boolean;
    /** Show the hint even when the field is untouched */
    showWhenUntouched?: boolean;
    children?: import('svelte').Snippet<[any]>;
  }

  let {
    for: name = $bindable(""),
    form = "svelte-use-form",
    class: _class = "",
    id = undefined,
    on = "",
    hideWhen = "",
    hideWhenRequired = false,
    showWhenUntouched = false,
    children
  }: Props = $props();

  if (!name) name = getContext(`${form}_hint-group-name`);

  // Get the form store from context
  const formContext: {
    subscribe: (
      callback: (form: Form<any> & FormControlsUnspecified) => any,
    ) => void;
  } = getContext(form);

  let touched = $derived($formContext[name]?.touched);
  let errors = $derived($formContext[name]?.errors || {});
  let hideWhenError = $derived(hideWhen ? !!errors[hideWhen] : false);
  let requiredError = $derived(!!errors["required"]);
  let value = $derived(errors[on]);
</script>

{#if !(hideWhenRequired && requiredError) && !hideWhenError}
  {#if (touched || showWhenUntouched) && value}
    <div {id} class="svelte-use-form-hint {_class}">
      {@render children?.({ value, })}
    </div>
  {/if}
{/if}
