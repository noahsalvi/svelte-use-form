<script lang="ts">
  import {
    HintGroup,
    Hint,
    minLength,
    useForm,
    validators,
    maxLength,
    email,
  } from "$lib";

  const formOne = useForm("form-one");
  const formTwo = useForm("form-two");
</script>

<form data-testid="form-one" use:formOne>
  <h4>Awesome Form 1</h4>
  <!-- Form one input -->
  <label for="input">My rules: minimum 3, maximum 5 character</label>
  <input
    type="text"
    name="input"
    placeholder="Type something..."
    data-testid="input-form-one"
    use:validators={[minLength(3), maxLength(5)]}
  />
  <Hint data-testid="hint-min-form-one" for="input" on="minLength" form="form-one"
    >Input must be more than 3 characters</Hint
  >
  <Hint data-testid="hint-max-form-one" for="input" on="maxLength" form="form-one"
    >Input must be less than 5 characters</Hint
  >

  <button on:click|preventDefault data-testid="submit-form-one" disabled={!$formOne.valid}>Submit</button>
</form>

<form data-testid="form-two" use:formTwo>
  <h4>Awesome Form 2</h4>
  <!-- Form two input -->
  <label for="input">My rules: minimum 5, maximum 7 character</label>
  <input
    type="text"
    name="input"
    placeholder="Type something..."
    data-testid="input-form-two"
    use:validators={[minLength(5), maxLength(7)]}
  />

  <HintGroup form="form-two" for="input">
    <Hint data-testid="hint-min-form-two" form="form-two" on="minLength" let:value>
      Input must be more than {value} characters
    </Hint>
    <Hint data-testid="hint-max-form-two" form="form-two" on="maxLength" let:value>
      Input must be less than {value} characters
    </Hint>
  </HintGroup>

  <button on:click|preventDefault data-testid="submit-form-two" disabled={!$formTwo.valid}>Submit</button>
</form>
