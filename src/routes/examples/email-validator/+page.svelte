<script lang="ts">
  import { useForm, validators } from "$lib";
  import { email_with_tld } from "$lib/validators";
  const form = useForm();
</script>

<form use:form>
  <input
    id="email_field"
    name="email_field"
    use:validators={[email_with_tld]}
  />
  <input
    type="checkbox"
    id="is-valid"
    checked={!!$form.email_field?.errors.email_with_tld}
  />
</form>
