<script lang="ts">
  import { minLength, required, useForm, validators } from "$lib";

  const form = useForm({ username: { initial: "Michael" } });
  let showUsername = false;
  let showPassword = false;
</script>

<form use:form>
  <button on:click|preventDefault={() => (showUsername = !showUsername)}
    >Toggle Username</button
  >
  {#if showUsername}
    <label for="username">Username</label>
    <input
      type="text"
      name="username"
      use:validators={[required, minLength(10)]}
    />
  {/if}
  <button on:click|preventDefault={() => (showPassword = !showPassword)}
    >Toggle Password</button
  >
  {#if showPassword}
    <div style="background: gray;">
      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        use:validators={[required, minLength(10)]}
      />
    </div>
  {/if}
</form>

<pre>
    {JSON.stringify($form, null, "  ")}
</pre>
