<script lang="ts">
  import { createBubbler, preventDefault } from 'svelte/legacy';

  const bubble = createBubbler();
  import {
    HintGroup,
    Hint,
    minLength,
    useForm,
    validators,
    maxLength,
    email,
  } from "$lib";

  const form = useForm();
</script>

<form use:form>
  <!-- Email -->
  <input
    type="email"
    name="email"
    placeholder="Email"
    use:validators={[email]}
    class:touched={$form.email?.touched}
  />
  <Hint for="email" on="email">Input is not a valid email</Hint>

  <!-- Password -->
  <input
    type="password"
    name="password"
    placeholder="Password"
    use:validators={[minLength(6), maxLength(12)]}
    class:touched={$form.password?.touched}
  />
  <HintGroup for="password">
    <Hint on="minLength" >{#snippet children({ value })}
          
        The password is too short, min = {value}
                {/snippet}
        </Hint>
    <Hint on="maxLength" >{#snippet children({ value })}
          
        The password is too long, max = {value}
                {/snippet}
        </Hint>
  </HintGroup>

  <button onclick={preventDefault(bubble('click'))} disabled={!$form.valid}>Login</button>
</form>
