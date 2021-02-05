# svelte-use-form
A svelte form library that is easy to use and has 0 boilerplate. It helps you control and validate forms and their inputs and check on the state of them.

## Installation
```bash
# npm
npm i -D svelte-use-form

# yarn
yarn add -D svelte-use-form
```
## Usage
It's pretty self-explanatory, just check out the examples below 😉<br>
Just make sure to prefix the form `$` , when accessing its state.

### Minimal Example
```html
<script>
  import { useForm, Validators } from "svelte-use-form";

  const form = useForm({ title: { validators: [Validators.minLength(5)] } });
</script>

<form use:form>
  <input name="title" />
  <button disabled={!$form.valid}>Submit</button> <br />
  {#if $form.title.touched && $form.title.errors.minLength}
    The title requires at least {$form.title.errors.minLength} characters.
  {/if}
</form>

```

### Login Example (Styling omitted)
```html
<script>
  import { useForm, Validators } from "svelte-use-form";
  const form = useForm({
    email: { validators: [Validators.email, Validators.required] },
    password: { validators: [Validators.required] },
  });
</script>

<form use:form>
  <h1>Login</h1>
  <input type="email" name="email" />
  <div class="error">
    {#if $form.email.touched}
      {#if $form.email.errors.required}
        This is a mandatory field
      {:else if $form.email.errors.email}
        Email is not valid
      {/if}
    {/if}
  </div>

  <input type="password" name="password" />
  <div class="error">
    {#if $form.password.touched && $form.password.errors.required}
      This is a mandatory field
    {/if}
  </div>
  <button disabled={!$form.valid}>Login</button>
</form>
```
## API
### const newForm = useForm(options)
useForm() returns a svelte `store` (Observable) that is also an `action`. (That's what I call [svelte](https://www.dictionary.com/browse/svelte) 😆)
#### newForm
Returns an `action` that can be used on a form. It binds the form state to the form element.
#### $newForm
Subscribe to the form with `$` prefix to access the state of the form. It returns a `Form` instance.
### Form
valid: boolean<br>
touched: boolean<br>
[formControl]: FormControl<br><br>
Every input in the form will be accessible through the form directly. e.g. <input name="email" /> === $form.email
### FormControl
value: string<br>
valid: boolean<br>
validate: function<br>
touched: boolean<br>
errors: {[errorName: string]: any}
