<script lang="ts">
  import { getContext } from "svelte";
  import type { Form } from "../models/form";

  export let name = "";
  export let on = "";
  export let hideWhen = "";
  export let hideWhenRequired = false;
  export let untouched = false;

  // Tries to get the name from the parent HintGroup
  if (!name) name = getContext("svelte-use-form_hint-group-name");

  const form: {
    subscribe: (callback: (form: Form) => any) => void;
  } = getContext("svelte-use-form_form");

  $: touched = $form[name]?.touched ?? {};
  $: errors = $form[name]?.errors ?? {};
  $: hideWhenError = hideWhen ? errors[hideWhen] : "";
  $: requiredError = errors["required"];
  $: value = errors[on];
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
