<script lang="ts">
  import { getContext } from "svelte";
  import type { Form } from "./form";

  const form: {
    subscribe: (callback: (form: Form) => any) => void;
  } = getContext("svelte-use-form_form");

  export let name = "";
  export let error = "";
  export let hideWhen = "";
  export let hideWhenRequired = false;
  export let untouched = false;
  console.log(name, error, hideWhenRequired);

  $: touched = $form[name].touched;

  $: errors = $form[name].errors;
  $: hideWhenError = hideWhen ? errors[hideWhen] : "";
  $: requiredError = errors["required"];
  $: value = errors[error];
</script>

{#if !(hideWhenRequired && requiredError) && !hideWhenError}
  {#if (touched || untouched) && value}
    <div class="svelte-use-form-hint">
      <slot {value} />
    </div>
  {/if}
{/if}

<style>
  .svelte-use-form-hint {
    color: red;
  }
</style>
