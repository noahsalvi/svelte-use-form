<script lang="ts">
  import {
    Hint,
    HintGroup,
    maxLength,
    minLength,
    useForm,
    validators,
    type Validator,
  } from "$lib";

  const form = useForm({ username: {} });

  const passwordMatch: Validator = (value, form) => {
    return value === form.password?.value
      ? null
      : { passwordMatch: "Passwords are not matching" };
  };
</script>

<form use:form>
  <!-- Password -->
  <input
    type="password"
    name="password"
    placeholder="Password"
    use:validators={[minLength(6), maxLength(12)]}
  />
  <Hint for="email" on="email">Input is not a valid email</Hint>

  <!-- Password Repeat -->
  <input
    type="password"
    name="password-repeat"
    placeholder="Repeat Password"
    use:validators={[minLength(6), maxLength(12), passwordMatch]}
  />
  <HintGroup for="password">
    <Hint on="minLength" let:value>
      The password is too short, min = {value}
    </Hint>
    <Hint on="maxLength" let:value>
      The password is too long, max = {value}
    </Hint>
  </HintGroup>

  <Hint for="password-repeat" on="passwordMatch">Passwords do not match</Hint>

  <button on:click|preventDefault disabled={!$form.valid}>Login</button>
</form>
