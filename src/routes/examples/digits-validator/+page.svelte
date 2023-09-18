<script lang="ts">
  import { useForm, validators, digits } from "$lib";

  const form = useForm();
</script>

<form use:form>
  <input
    id="testDigitsField"
    name="testDigitsField"
    use:validators={[digits]}
  />
  <input
    type="checkbox"
    id="isValid"
    checked={!!$form.testDigitsField?.errors.digits}
  />
</form>
