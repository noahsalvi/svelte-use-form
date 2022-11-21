<script lang="ts">
  import { email, minLength, required, useForm, validators } from "$lib";

  const form = useForm();
</script>

test
<form use:form>
  <input type="text" name="email" use:validators={[required, email]} />
  {#if $form.email}
    Email registered
  {/if}
  <input type="text" name="search" data-suf-ignore />
  {#if $form.search}Search registered{/if}
</form>
