<script>
  import {
    Hint,
    useForm,
    minLength,
    validators,
    maxLength,
    required,
  } from "$lib";
  import HintGroup from "$lib/components/HintGroup.svelte";
  const form = useForm();
  let loading = false;

  const checkUsernameAvailability = (value) => {
    loading = true;

    fetch("https://randomuser.me/api/?username=" + value).then((_) => {
      // If there are already some validation errors, stop.
      if (!$form.username.valid) return;

      // Check if the username is available
      const isUsernameAvailable = Math.floor(Math.random() * 2) === 0;

      if (isUsernameAvailable) {
        // Sett the error manually
        $form.username?.error({ username: true });
      }

      loading = false;
    });

    return null;
  };
</script>

<form use:form>
  <input
    name="name"
    autocomplete="off"
    placeholder="Name"
    use:validators={[required]}
  />

  <input
    name="username"
    placeholder="Username Async Validated"
    autocomplete="off"
    use:validators={[minLength(5), maxLength(10), checkUsernameAvailability]}
  />
  <HintGroup for="username">
    <Hint on="minLength">Username too short.</Hint>
    <Hint on="maxLength">Username too long.</Hint>
    <Hint on="username">Username is not available.</Hint>
  </HintGroup>

  (Username availability is random)
  <hr />

  <button disabled={loading || !$form.valid}> Submit </button>
</form>

<style>
  :global(input:invalid.touched) {
    border-color: red;
  }

  input {
    border: 2px solid black;
  }
</style>
