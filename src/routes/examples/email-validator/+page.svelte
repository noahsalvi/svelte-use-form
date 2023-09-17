<script lang="ts">
  import { useForm, validators, emailWithTld } from "$lib";

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
