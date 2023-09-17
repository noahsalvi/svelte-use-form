<script lang="ts">
  import { useForm, validators } from "$lib";
  import { emailWithTld } from "$lib/validators";
  const form = useForm();
</script>

<form use:form>
  <input id="email_field" name="email_field" use:validators={[emailWithTld]} />
  <input
    type="checkbox"
    id="is-valid"
    checked={!!$form.email_field?.errors.emailWithTld}
  />
</form>
