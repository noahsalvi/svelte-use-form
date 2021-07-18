<script lang="ts">
  import {
    useForm,
    HintGroup,
    Hint,
    number,
    required,
    minLength,
    maxLength,
    email,
  } from "svelte-use-form";
  const form = useForm({
    email: { validators: [email, required] },
    password: {
      validators: [required, minLength(5), maxLength(10)],
    },
    luckyNumber: {
      validators: [number],
    },
  });
</script>

<form use:form>
  <h1>Login</h1>
  <input type="email" name="email" />
  <Hint name="email" on="required">This is a mandatory field</Hint>
  <Hint name="email" on="email" hideWhenRequired>Email is not valid</Hint>

  <input type="password" name="password" />
  <HintGroup name="password">
    <Hint on="required">This is a mandatory field</Hint>
    <Hint on="minLength" hideWhen="required" let:value>
      A lil bit too short {value}
    </Hint>
    <Hint on="maxLength" let:value>
      Can't be longer than {value}
    </Hint>
  </HintGroup>

  <input type="text" name="luckyNumber" />
  <Hint name="luckyNumber" on="number">Is not a number!</Hint>

  <input type="text" name="slogan" />
  {$form.slogan?.value}
  <button disabled={!$form.valid}>Login</button>
</form>

<style>
  form {
    background: whitesmoke;
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: 0 auto;
    padding: 25px 50px;
    margin-top: 0px;
  }

  h1 {
    margin-top: 0;
  }

  button {
    background: rgb(188, 188, 240);
    cursor: pointer;
  }

  :disabled {
    background: rgb(228, 228, 250);
    cursor: default;
  }
</style>
