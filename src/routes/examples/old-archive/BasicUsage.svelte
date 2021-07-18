<script>
  import { useForm } from "$lib";

  const form = useForm({ title: { validators: [minLength(5)] } });
</script>

<form use:form>
  <input name="title" />
  <button disabled={!$form.valid}>Submit</button> <br />
  {#if $form.title.touched && $form.title.errors.minLength}
    The title requires at least {$form.title.errors.minLength} characters.
  {/if}
</form>
