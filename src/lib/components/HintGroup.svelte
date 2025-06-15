<script lang="ts">
  import { setContext } from "svelte";
  /**
   *  The name of the form control.
   *
   * ``` svelte
   * <input name="nameOfFormControl" use:validators={[required]} />
   * <HintGroup for="nameOfFormControl">
   *   <Hint on="required">HINT</Hint>
   * </HintGroup>
   * ```
   * OR
   * ``` svelte
   * <input name="nameOfFormControl" use:validators={[required]} />
   * <Hint for="nameOfFormControl" on="required">HINT</Hint>
   * ```
   */
  

  interface Props {
    form?: string;
    for?: string;
    children?: import('svelte').Snippet<[any]>;
  }

  let { form = "svelte-use-form", for: name = "", children }: Props = $props();

  setContext(`${form}_hint-group-name`, name);
</script>

{@render children?.({ form, })}
