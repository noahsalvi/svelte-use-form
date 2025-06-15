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
  } from "$lib";

  const formOne = useForm({}, "form-one");
  const formTwo = useForm({}, "form-two");
</script>

<form id="form-one" use:formOne>
  <h4>Awesome Form 1</h4>
  <!-- Form one input -->
  <label for="input">My rules: minimum 3, maximum 5 character</label>
  <input
    type="text"
    name="input"
    placeholder="Type something..."
    id="input-form-one"
    use:validators={[minLength(3), maxLength(5)]}
  />
  <Hint id="hint-min-form-one" for="input" on="minLength" form="form-one"
    >Input must be more than 3 characters</Hint
  >
  <Hint id="hint-max-form-one" for="input" on="maxLength" form="form-one"
    >Input must be less than 5 characters</Hint
  >

  <button
    onclick={preventDefault(bubble('click'))}
    id="submit-form-one"
    disabled={!$formOne.valid}>Submit</button
  >
</form>

<form id="form-two" use:formTwo>
  <h4>Awesome Form 2</h4>
  <!-- Form two input -->
  <label for="input">My rules: minimum 5, maximum 7 character</label>
  <input
    type="text"
    name="input"
    placeholder="Type something..."
    id="input-form-two"
    use:validators={[minLength(5), maxLength(7)]}
  />

  <HintGroup form="form-two" for="input">
    <Hint id="hint-min-form-two" form="form-two" on="minLength" >{#snippet children({ value })}
          
        Input must be more than {value} characters
                {/snippet}
        </Hint>
    <Hint id="hint-max-form-two" form="form-two" on="maxLength" >{#snippet children({ value })}
          
        Input must be less than {value} characters
                {/snippet}
        </Hint>
  </HintGroup>

  <button
    onclick={preventDefault(bubble('click'))}
    id="submit-form-two"
    disabled={!$formTwo.valid}>Submit</button
  >
</form>
