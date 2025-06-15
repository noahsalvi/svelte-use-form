<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import {
    HintGroup,
    Hint,
    minLength,
    useForm,
    validators,
    maxLength,
    email,
  } from "$lib";

  const form = useForm();

  const resetForm = () => $form.reset();

  const resetFoo = () => {
    $form.value1?.reset({ value: "Foo" });
    $form.value2?.reset({ value: "Bar" });
  };
</script>

<form use:form>
  <!-- Email -->
  <input
    type="text"
    name="value1"
    placeholder="Value 1"
    use:validators={[email]}
  />
  <Hint for="value1" on="email">Input is not a valid email</Hint>

  <!-- Password -->
  <input
    type="text"
    name="value2"
    placeholder="Value 2"
    use:validators={[minLength(6), maxLength(12)]}
  />
  <HintGroup for="value2">
    <Hint on="minLength" >{#snippet children({ value })}
          
        The password is too short, min = {value}
                {/snippet}
        </Hint>
    <Hint on="maxLength" >{#snippet children({ value })}
          
        The password is too long, max = {value}
                {/snippet}
        </Hint>
  </HintGroup>

  <button onclick={preventDefault(resetForm)}>Reset Form</button>

  <button onclick={preventDefault(resetFoo)}>Reset Controls to "Foo"</button>
  {#if $form.valid}
    Form is Valid
  {/if}
</form>
