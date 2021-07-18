<script lang="ts">
  import {
    useForm,
    validators,
    Hint,
    HintGroup,
    required,
    minLength,
  } from "svelte-use-form";

  const form = useForm({ name: { validators: [minLength(5)] } });

  let show = false;
</script>

<form use:form>
  <input type="text" name="name" use:validators={[required]} />
  <HintGroup for="name">
    <Hint on="required">Test</Hint>
  </HintGroup>

  {#if show}
    <input
      type="text"
      name="lastName"
      use:validators={[required, minLength(5)]}
    />
    <HintGroup for="lastName">
      <Hint on="required">Test</Hint>
    </HintGroup>
  {/if}
  <button on:click|preventDefault={() => (show = !show)}>test</button>
</form>

<pre>
  {JSON.stringify($form, null, " ")}
</pre>

<style>
  :invalid {
    border-color: inherit;
  }

  :global(input.touched:invalid) {
    border-color: red;
  }
</style>
