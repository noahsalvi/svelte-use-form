# Usage
```html
<script>
  import { useForm, Validators } from "svelte-use-form";

  const form = useForm({ password: { validators: [Validators.minLength(5)] } });
</script>

<form use:form>
  <input name="password" />
  <button disabled={!$form.valid}>Submit</button> <br />
  
  {#if $form.password.touched && $form.password.errors.minLength}
    The password requires at least {$form.password.errors.minLength} characters.
  {/if}
</form>
```
