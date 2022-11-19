<script lang="ts">
  import { useForm } from "$lib";

  const form = useForm();
</script>

<form use:form>
  <input name="birthday" type="datetime-local" />
  Value as Date: {$form.birthday?.valueAsDate}

  <input name="favoriteNumber" type="number" />
  Value as Number: {$form.favoriteNumber?.valueAsNumber}

  <input name="rememberMe" type="checkbox" />
  Value as Boolean: {$form.rememberMe?.valueAsBoolean}

  {JSON.stringify($form.values, null, "  ")}
</form>
