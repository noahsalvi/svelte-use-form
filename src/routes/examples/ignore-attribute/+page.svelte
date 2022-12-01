<script lang="ts">
  import { email, required, useForm, validators } from "$lib";

  const form = useForm();
</script>

test
<form use:form data-testid="form-attributes">
  <label for="email">Email [💡 Do not ignore]</label>
  <input
    type="text"
    name="email"
    placeholder="no attribute"
    use:validators={[required, email]}
  />
  <label for="name">Name [💡 Do not ignore]</label>
  <input
    type="text"
    name="name"
    placeholder="data-suf-ignore="false""
    use:validators={[required]}
    data-suf-ignore="false"
  />
  <label for="input1">Input1 [❌ Ignore]</label>
  <input
    type="text"
    name="input1"
    placeholder="data-suf-ignore={true}"
    data-suf-ignore={true}
  />

  <label for="input2">Input2 [❌ Ignore]</label>
  <input
    type="text"
    name="input2"
    placeholder="data-suf-ignore="true""
    data-suf-ignore="true"
  />

  <p>Registered inputs:</p>
  <ul data-testid="registered">
    {#each Object.keys($form.values) as input}
      <li>{input}</li>
    {/each}
  </ul>
</form>
