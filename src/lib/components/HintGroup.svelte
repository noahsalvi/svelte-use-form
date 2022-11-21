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
  export { name as for };
  export let form: string = "svelte-use-form_form";

  let name = "";

  setContext(`${form}_hint-group-name`, name);
</script>

<slot form />
