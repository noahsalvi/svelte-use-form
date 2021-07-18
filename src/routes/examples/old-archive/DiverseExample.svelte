<script lang="ts">
  import { useForm, required } from "svelte-use-form";
  const form = useForm({
    radio: { validators: [required], initial: "Dort" },
    textarea: {
      validators: [required],
    },
    select: {
      initial: "Drei",
    },
  });
</script>

<form use:form>
  <input type="text" name="input" />
  {JSON.stringify($form.input)}
  <hr />

  <textarea type="text" name="textarea" />
  {JSON.stringify($form.textarea)}
  <hr />

  <input type="radio" name="radio" value="Eins" />
  <input type="radio" name="radio" value="Zwei" />
  <input type="radio" name="radio" value="Drei" />
  {JSON.stringify($form.radio)}
  <hr />

  <select name="select">
    <option value="Eins">1</option>
    <option value="Zwei">2</option>
    <option value="Drei">3</option>
  </select>
  {JSON.stringify($form.select)}
  <hr />

  <input type="checkbox" name="checkbox" value="markus" />
  {JSON.stringify($form.checkbox)}
  <hr />
  <button>Submit</button>
</form>
<br />
<br />
<br />
Form: {JSON.stringify({ valid: $form.valid })}<br />

{JSON.stringify($form.values)}
