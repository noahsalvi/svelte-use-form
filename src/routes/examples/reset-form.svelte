<script lang="ts">
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
    <Hint on="minLength" let:value>
      The password is too short, min = {value}
    </Hint>
    <Hint on="maxLength" let:value>
      The password is too long, max = {value}
    </Hint>
  </HintGroup>

  <button on:click|preventDefault={resetForm}>Reset Form</button>

  <button on:click|preventDefault={resetFoo}>Reset Controls to "Foo"</button>
  {#if $form.valid}
    Form is Valid
  {/if}
</form>
