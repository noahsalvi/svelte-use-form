<script>
  import { tick } from "svelte";

  /*
	 This REPL should reproduce problem problem reported at issue:
	 https://github.com/noahsalvi/svelte-use-form/issues/23
	 */
  import SupposedDialog from "./_ReuseFormDialog.svelte";

  const persons = [
    { id: 1, nome: "John Doe", ativo: true },
    { id: 2, nome: "Mary Doe", ativo: false },
  ];
  const NEW_PERSON = { nome: "", ativo: true };

  const addPerson = () => {
    editPerson(NEW_PERSON);
  };
  const editPerson = async (person) => {
    selectedPerson = { ...person };
    await tick();
    dialog.open();
  };

  let dialog;
  let selectedPerson = { ...NEW_PERSON };
</script>

<h3>Svelte-use-form "reusing form" test</h3>
<button class="btn" on:click|preventDefault={addPerson}>New person</button>
<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Nome</th>
      <th>Ativo</th>
      <th />
    </tr>
  </thead>
  <tbody>
    {#each persons as p}
      <tr>
        <td>{p.id}</td>
        <td>{p.nome}</td>
        <td>{p.ativo ? "Yes" : "No"}</td>
        <td>
          <buton class="btn" on:click={() => editPerson(p)}>Edit</buton>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<hr />

{#key selectedPerson}
  <SupposedDialog bind:this={dialog} person={selectedPerson} />
{/key}

<style>
  .btn {
    border: 1px solid;
    padding: 3px;
    background-color: lightgray;
    cursor: pointer;
  }
</style>
