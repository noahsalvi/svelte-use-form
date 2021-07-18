<script lang="ts">
  import { required, email, useForm } from "svelte-use-form";
  const form = useForm({
    email: {
      validators: [email, required],
    },
    password: {
      validators: [required],
    },
  });
  $: console.log($form.values);
</script>

<form use:form>
  <h1>Login</h1>
  <input type="email" name="email" />
  <div class="error">
    {#if $form.email.touched}
      {#if $form.email.errors.required}
        This is a mandatory field
      {:else if $form.email.errors.email}
        Email is not valid
      {/if}
    {/if}
  </div>

  <input type="password" name="password" />
  <div class="error">
    {#if $form.password.touched && $form.password.errors.required}
      This is a mandatory field
    {/if}
  </div>
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

  .error {
    color: red;
    height: 40px;
  }
</style>
