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
</script>

<form use:form>
  <!-- Email -->
  <input
    type="email"
    name="email"
    placeholder="Email"
    use:validators={[email]}
  />
  <Hint for="email" on="email">Input is not a valid email</Hint>

  <!-- Password -->
  <input
    type="password"
    name="password"
    placeholder="Password"
    use:validators={[minLength(6), maxLength(12)]}
  />
  <HintGroup for="password">
    <Hint on="minLength" let:value>
      The password is too short, min = {value}
    </Hint>
    <Hint on="maxLength" let:value>
      The password is too long, max = {value}
    </Hint>
  </HintGroup>

  <button on:click|preventDefault disabled={!$form.valid}>Login</button>
</form>
