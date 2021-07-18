<script lang="ts">
  import { useForm, validators, required } from "svelte-use-form";
  import validator from "validator";

  const form = useForm();

  // Inline
  const isMobile = (value) =>
    validator.isMobilePhone(value, ["de-CH"])
      ? null
      : { mobile: "This field is not valid" };

  // Or Using a converter
  const isAlpha = converter(
    validator.isAlpha,
    "Can only contain alpha characters."
  );

  // Valid IBAN DE91100000000123456789
  const isIBAN = converter(validator.isIBAN, null);

  function converter(validatorFn, message) {
    const validatorName = validatorFn.name;
    message = message ?? "ValidatorJS invalid";

    return function (value) {
      const valid = validatorFn(value);

      if (!valid) {
        const error = {};
        error[validatorName] = message;
        return error;
      }
    };
  }
</script>

<form use:form>
  <button
    on:click|preventDefault={() => {
      $form.touched = true;
    }}>Touch form</button
  >
  <input type="text" name="noah" />
  isMobile
  <input
    name="mobile"
    use:validators={[isMobile]}
    on:input={(input) => console.log(input)}
  />
  valid: {$form.mobile?.valid} <br />
  {JSON.stringify($form.mobile?.errors)}

  <br />
  <br />

  isAlpha
  <input name="alpha" use:validators={[isAlpha]} />
  valid: {$form.alpha?.valid} <br />
  {JSON.stringify($form.alpha?.errors)}

  <br />
  <br />

  isIban
  <input name="iban" use:validators={[isIBAN]} />
  valid: {$form.iban?.valid} <br />
  {JSON.stringify($form.iban?.errors)}
</form>

<pre>
{JSON.stringify($form, null, " ")}
{console.log($form)}
</pre>

<style>
  :global(input.touched:invalid) {
    border-color: red;
    outline-color: red;
  }
</style>
