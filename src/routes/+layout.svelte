<script lang="ts">
  import NavigationBar from "./NavigationBar.svelte";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<NavigationBar />
<main>
  {@render children?.()}
</main>

<style>
  :global(input.touched:invalid) {
    border-color: red;
  }

  :global(.svelte-use-form-hint) {
    background: rgb(255, 229, 198);
    padding: 10px;
    border-radius: 5px;
    display: flex;
    margin-bottom: 10px;
  }

  :global(html) {
    font-family: sans-serif;
  }

  :global(html),
  :global(body),
  :global(#svelte) {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  :global(#svelte) {
    display: flex;
    flex-direction: column;
  }

  main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  :global(form) {
    margin: auto;
    display: flex;
    flex-direction: column;
    width: 400px;
    background: whitesmoke;
    padding: 30px;
    border-radius: 10px;
  }

  :global(form button) {
    height: 36px;
    margin-bottom: 0;
    background: rgb(254, 182, 39);
    border-radius: 8px;
    border: none;
    font-size: 16px;
    font-weight: bold;
  }

  :global(button) {
    cursor: pointer;
  }

  :global(button:disabled) {
    opacity: 0.6;
  }

  :global(input) {
    height: 30px;
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 0 10px;
    outline: none;
  }

  :global(input:focus) {
    border-color: rgb(64, 164, 251);
  }
</style>
