<script lang="ts">
  import { useForm, required } from "$lib";

  const form = useForm({ email: { validators: [required] } });

  function submit() {
    $form.email.error({ loginFail: "Password is incorrect" });
    console.log($form.email);
  }

  function message(formControl) {
    const errors = Object.values(formControl.errors);
    return errors.length ? errors[0] : "";
  }
</script>

<form use:form on:submit|preventDefault={submit}>
  <button on:click|preventDefault={submit}> Server Error </button>
  <input name="email" />

  {message($form.email)}
</form>
{JSON.stringify($form.email.errors)}
