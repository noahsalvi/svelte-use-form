<script lang="ts">
  import { useForm, validators, Hint, minLength, required } from "$lib";
  let aValue = "world";
  const form = useForm({
    copy: { validators: [required] },
  });

  const matchValidator = (matchString: string) => (formValue: string) => {
    if (formValue != matchString) {
      return { nomatch: `Not matching ${matchString}` };
    }
  };
</script>

<form use:form>
  <input id="inputA" bind:value={aValue} />
  B
  <input
    id="inputB"
    name="copy"
    use:validators={[matchValidator(aValue), minLength(2)]}
  />
  Does B match A?<b id="is-matching">{$form.copy?.valid ? "Yes" : "No"}</b>
  Is required triggered?
  <input
    type="checkbox"
    id="is-empty"
    checked={!!$form.copy?.errors.required}
  />
</form>
<pre>
    {JSON.stringify($form.copy?.errors, null, "  ")}
</pre>

<style>
  form {
    display: flex;
    flex-direction: column;
  }
</style>
