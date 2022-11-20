<script>
  import NavigationBar from "./NavigationBar.svelte";
</script>

<NavigationBar />
<main>
  <slot />
</main>

<style global>
  input.touched:invalid {
    border-color: red;
  }

  .svelte-use-form-hint {
    background: rgb(255, 229, 198);
    padding: 10px;
    border-radius: 5px;
    display: flex;
    margin-bottom: 10px;
  }

  html {
    font-family: sans-serif;
  }

  html,
  body,
  #svelte {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  #svelte {
    display: flex;
    flex-direction: column;
  }

  main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  form {
    margin: auto;
    display: flex;
    flex-direction: column;
    width: 400px;
    background: whitesmoke;
    padding: 30px;
    border-radius: 10px;
  }

  form button {
    height: 36px;
    margin-bottom: 0;
    background: rgb(254, 182, 39);
    border-radius: 8px;
    border: none;
    font-size: 16px;
    font-weight: bold;
  }

  button {
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
  }

  input {
    height: 30px;
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 0 10px;
    outline: none;
  }

  input:focus {
    border-color: rgb(64, 164, 251);
  }
</style>
