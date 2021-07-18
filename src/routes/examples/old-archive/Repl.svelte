<script>
  import {
    useForm,
    Hint,
    HintGroup,
    validators,
    required,
    minLength,
  } from "$lib";

  const form = useForm({ status: { validators: [required] } });

  let showNameField = false;

  function cantBeBrown(value) {
    if (value === "brown") return { cantBeBrown: true };
  }
</script>

<main>
  <form use:form>
    <h1>Edge Cases</h1>

    <label for="color">Select</label>
    <select name="color" use:validators={[cantBeBrown]}>
      <option value="red">Red</option>
      <option value="yellow">Yellow</option>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
      <option value="brown">Brown</option>
    </select>
    <Hint for="color" on="cantBeBrown">
      No one has brown as their favorite color 😦
    </Hint>

    <br />

    {#if showNameField}
      <label for="optional">Name</label>
      <input name="optional" use:validators={[minLength(5)]} />
      <Hint for="optional" on="minLength" let:value
        >Must be at least {value} characters long.</Hint
      >
    {/if}
    <button on:click|preventDefault={() => (showNameField = !showNameField)}>
      Toggle Name field
    </button>

    <label for="status">Status</label>
    Online
    <input name="status" type="radio" value="online" />
    Inactive
    <input name="status" type="radio" value="inactive" />
    Offline
    <input name="status" type="radio" value="offline" />

    <label for="notify">Notify</label>
    <input name="notify" type="checkbox" use:validators={[required]} checked />

    <label for="description">Description</label>
    <textarea name="description" use:validators={[required]} />

    <br />

    <button disabled={!$form.valid}> Submit </button>
  </form>
  <pre>
		{JSON.stringify($form, null, 1)}
	</pre>
</main>

<style>
  :global(.touched:invalid) {
    border-color: red;
    outline-color: red;
  }

  main {
    display: flex;
    justify-content: space-around;
  }

  pre {
    height: 80vh;
    overflow: auto;
    font-size: 12px;
  }
</style>
