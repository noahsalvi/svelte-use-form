<script lang="ts">
  import { useForm, validators } from "$lib";
  import { emailWithTld } from "$lib/validators";
  const form = useForm();
</script>

<form use:form>
  <input
    id="testEmailField"
    name="testEmailField"
    use:validators={[emailWithTld]}
  />
  <input
    type="checkbox"
    id="isValid"
    checked={!!$form.testEmailField?.errors.emailWithTld}
  />
</form>
