<script lang="ts">
  import { setContext } from "svelte";
  export let name = "";

  setContext("svelte-use-form_hint-group-name", name);
</script>

<slot />
