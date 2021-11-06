<script>
  import { Hint, required, useForm, validators } from "$lib";
  const form = useForm();

  export let person = { nome: "", ativo: true };
  export let showDialog = false;

  export const open = () => {
    showDialog = true;
    $form.reset();
    setTimeout(() => $form.reset(), 50);
    console.log("person:", person);
  };

  const formSubmit = () => {
    if ($form.valid) {
      alert("Submitted valid form");
      showDialog = false;
    } else {
      alert("Form is still invalid");
    }
  };
</script>

{#if showDialog}
  <form
    autocomplete="off"
    use:form
    on:submit|preventDefault={formSubmit}
    novalidate
  >
    <h5>Form</h5>
    <p>
      <input
        type="text"
        name="nome"
        placeholder="Nome da pessoa"
        value={person.nome}
        use:validators={[required]}
      />
      <Hint for="nome" on="required">Required field</Hint>
    </p>
    <p>
      <input
        name="ativo"
        class="form-check-input"
        type="checkbox"
        checked={person.ativo}
      />
      <label class="form-check-label" for="ativo">Ativo</label>
    </p>
    <button type="submit" class="btn" value="Submit" />
    <br />

    Form is valid?
    <strong>{$form.valid}</strong>
  </form>
{/if}

<style>
  .btn {
    border: 1px solid;
    padding: 3px;
    background-color: lightgray;
    cursor: pointer;
  }
</style>
