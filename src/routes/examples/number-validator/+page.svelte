<script lang="ts">
  import { useForm, validators, number } from "$lib";

  const form = useForm();
</script>

<form use:form>
  <input
    id="testNumberField"
    name="testNumberField"
    use:validators={[number]}
  />
  <input
    type="checkbox"
    id="isValid"
    checked={!!$form.testNumberField?.errors.number}
  />
</form>
