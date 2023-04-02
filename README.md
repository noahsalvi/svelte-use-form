<h1>
  <img align="left" height=36 src="svelte-use-form.svg" />
  &nbsp;
  <span align="left">svelte-use-form</span>
</h1>

A Svelte form library that enables you to create complicated forms with minimal effort. As for Svelte, the focus is **DX** 💻‍✨

```bash
npm i -D svelte-use-form
```

<a href="https://npmjs.com/package/svelte-use-form">![GitHub package.json version](https://img.shields.io/github/package-json/v/noahsalvi/svelte-use-form?style=for-the-badge)</a>
<a href="https://npmjs.com/package/svelte-use-form">![npm](https://img.shields.io/npm/dw/svelte-use-form?style=for-the-badge)</a>

**Features:**

- Minimalistic - Don't write more than necessary.
- No new components, bindings or callbacks required
- Validators included and custom validator support
- Automagically binds to inputs

# Usage

It's pretty self-explanatory… check out the examples below 😉

Just make sure to prefix the form with `$`, when accessing its state.

**Minimal Example** [REPL](https://svelte.dev/repl/faf5a9ab763640ed830028c970421f72?version=3.35.0)

```svelte
<script>
  import { useForm, Hint, validators, minLength } from "svelte-use-form";

  const form = useForm();
</script>

<form use:form>
  <input name="title" use:validators={[minLength(5)]} />
  <Hint for="title" on="minLength" let:value>
    The title requires at least {value} characters.
  </Hint>

  <button disabled={!$form.valid}>Submit</button> <br />
</form>
```

or you could also print the error message like this:

```svelte
...
{#if $form.title?.touched && $form.title?.errors.minLength}
  The title requires at least {$form.title.errors.minLength} characters.
{/if}
```

## More Examples

<details>
  <summary>
    <b>
      Login Example 
      <a href="https://svelte.dev/repl/ca967b45a5aa47b2bb2f9118eb79eefe?version=3">
        REPL
      </a>
    </b>
  </summary>

```svelte
<script>
  import {
    useForm,
    HintGroup,
    Hint,
    validators,
    email,
    required,
  } from "svelte-use-form";

  const form = useForm();
</script>

<form use:form>
  <h1>Login</h1>

  <input type="email" name="email" use:validators={[required, email]} />
  <HintGroup for="email">
    <Hint on="required">This is a mandatory field</Hint>
    <Hint on="email" hideWhenRequired>Email is not valid</Hint>
  </HintGroup>

  <input type="password" name="password" use:validators={[required]} />
  <Hint for="password" on="required">This is a mandatory field</Hint>

  <button disabled={!$form.valid}>Login</button>
</form>
```

</details>

<details>
  <summary>
    <b>
      Registration Example 
      <a href="https://svelte.dev/repl/a6665267d7d0435ebc7921a250552a25?version=3.34.0">
        REPL
      </a>
    </b>
  </summary>

```svelte
<script>
  import {
    useForm,
    Hint,
    HintGroup,
    validators,
    required,
    minLength,
    email,
  } from "svelte-use-form@2.0.0";

  const form = useForm();
  const requiredMessage = "This field is required";

  function passwordMatch(value, form) {
    if (value !== form.values.password) {
      return { passwordMatch: true };
    }
  }

  function containNumbers(numbers) {
    return function (value) {
      if (value.replace(/[^0-9]/g, "").length < numbers) {
        return { containNumbers: numbers };
      }
    };
  }
</script>

<main>
  <form use:form>
    <h1>Registration</h1>
    <label for="email">Email</label>
    <input type="email" name="email" use:validators={[required, email]} />
    <HintGroup for="email">
      <Hint on="required">{requiredMessage}</Hint>
      <Hint on="email" hideWhenRequired>This must be a valid email</Hint>
    </HintGroup>

    <label for="name">Name</label>
    <input type="text" name="name" />

    <label for="password">Password</label>
    <input
      type="password"
      name="password"
      use:validators={[required, minLength(5), containNumbers(2)]}
    />
    <HintGroup for="password">
      <Hint on="required">{requiredMessage}</Hint>
      <Hint on="minLength" hideWhenRequired let:value
        >This field must have at least {value} characters.</Hint
      >
      <Hint on="containNumbers" hideWhen="minLength" let:value>
        This field must contain at least {value} numbers.
      </Hint>
    </HintGroup>

    <label for="passwordConfirmation">Password Confirmation</label>
    <input
      type="password"
      name="passwordConfirmation"
      use:validators={[required, passwordMatch]}
    />
    <HintGroup for="passwordConfirmation">
      <Hint on="required">{requiredMessage}</Hint>
      <Hint on="passwordMatch" hideWhenRequired>Passwords do not match</Hint>
    </HintGroup><br />

    <button disabled={!$form.valid} on:click|preventDefault> Submit </button>
  </form>
  <pre>
		{JSON.stringify($form, null, 1)}
	</pre>
</main>

<style>
  :global(.touched:invalid) {
    border-color: red;
    outline-color: red;
  }

  main {
    display: flex;
    justify-content: space-around;
  }

  pre {
    height: 80vh;
    overflow: auto;
    font-size: 12px;
  }
</style>
```

</details>

**[Edge Cases REPL](https://svelte.dev/repl/d4fc021f688d4ad0b3ceb9a1c44c9be9?version=3.34.0)**

# API

## `useForm(properties: FormProperties?, formName?: string)`

useForm() returns a svelte `store` (Observable) that is also an `action`. (That's what I call [svelte](https://www.dictionary.com/browse/svelte) 😆)

### Why specify `FormProperties`?

Providing the names of the properties as arguments allows us to initialize all form controls in the form before the site is actually rendered. Thus you won't need to null-check them when accessing them.

```svelte
const form = useForm({ firstName: {} });
$form.firstName // Works as expected
$form?.lastName // lastName would be null on page load
```

### Why specify `formName`?

By providing a name you'll have the ability to specifically reference a form from a `Hint` component instead of inferring it from context.

`useForm({}, "form-1")` --> `<Hint form="form-1"...>`.

This allows you to use multiple `useForm` instances in a single component.

### `$form`

Subscribe to the form with `$`-prefix to access the state of the form. It returns a `Form` instance.

### `Form`

**Remark**: In reality the "Form" is an union of multiple types and its self.

```typescript
class Form {
  valid: boolean;
  touched: boolean;
  values: {
    [controlName: string]: string;
  };
  reset(): void;
  [controlName: string]: FormControl | undefined;
}
```

### `FormProperties` (Optional)

```typescript
export type FormProperties = {
  [key: string]: {
    /** Initial value of the form control */
    initial?: string;
    /** The validators that will be checked when the input changes */
    validators?: Validator[];
    /**
     * The map through which validation errors will be mapped.
     * You can either pass a string or a function returning a new error value
     *
     * **Think of it as a translation map. 😆**
     */
    errorMap?: ErrorMap;
  };
};
```

## `FormControl`

A FormControl represents an input of the form. (input, textarea, radio, select...)

**Important**:
Every control in the form will be accessible through `$form` directly via the `name` attribute.

e.g. `<input name="email" />` --> `$form.email`

```typescript
class FormControl {
  value: string;
  touched: boolean;
  validators: Validator[];
  /** Does the FormControl pass all given validators? */
  valid: boolean;
  /** The initial value of the FormControl. */
  initial: string;
  /** The DOM elements representing this control*/
  elements: FormControlElement[];

  /** Returns an object containing possible validation errors */
  errors: ValidationErrors;
  /**
   * Contains a map of values, that will be shown
   * in place of the original validation error.
   */
  errorMap: ErrorMap;

  error(errors: ValidationErrors): void;
  /** Change the value and the value of all HTML-Elements associated with this control */
  change(value: any): void;
  /** Validate the FormControl by querying through the given validators. */
  validate(): boolean;
  /** Reset the form control value to its initial value or `{ value }` and untouch it */
  reset({ value }?: { value?: string | null }): void;
}
```

## `use:validators` (Action)

Takes in the validators that should be used on the form control.
e.g.

```svelte
<input name="email" use:validators={[required, email]} />
```

## `<Hint></Hint>`

Helper component for displaying information based on errors in an input.

**Properties:**

- `for="name_of_input"` - Name of concerning input
- `on="error"` - The error which should trigger it

**Optional attributes:**

- `form="form-name"` - Name of the form. Defaults to form from context.
- `hideWhen="different_error"` - Hides the hint if the error is active
- `hideWhenRequired` - Shortcut for hideWhen="required"
- `showWhenUntouched` - Display Hint even if the field hasn't been touched yet
- `let:value` - Returns the value of the error

## `<HintGroup><Hint></Hint></HintGroup>`

You can omit the Hint `for` property when wrapping it with a `HintGroup`.

**Properties:**

- `for="name_of_input"`

**Optional Properties:**

- `form="form-name"` - Name of the form. Defaults to form from context.

## Ignore a form control

You can ignore a form control element by adding the `data-suf-ignore` attribute to it.

```svelte
<input name="email" data-suf-ignore />
```

This will prevent it from being added to the form elements.
And thus it won't be validated or observed for changes.

## Validators

- `required`
- `minLength(n)`
- `maxLength(n)`
- `number`
- `email`
- `url`
- `pattern(regExp)`

### Custom Validator

A validator needs to be a function that returns null if valid else an object with the key being the name of the error. The value of the object will be accessible through the error. e.g. $form.title.errors.name_of_error -> 'info'.

```typescript
const passwordMatch: Validator = (value, form) => {
  return value === form.password?.value
    ? null
    : { passwordMatch: "Passwords are not matching" };
}
```

```
... use:validators={[passwordMatch]}
  or
... passwordConfirmation: { validators: [passwordMatch] } }

... $form.title.errors.passwordMatch
```

An example with [validator.js](https://www.npmjs.com/package/validator) [REPL](https://svelte.dev/repl/21fc7637645d4917994ad4140b54b871?version=3.35.0)

# Remarks

## Chrome Autofill Solution

When Chrome autofills the form on page load, it will always register all inputs as valid. After clicking anywhere on the site, pressing a key or pressing the submit button it will then reevaluate all fields and update the state of the form.

This solution was needed due to Chrome's way of autofilling forms without actually setting the value of the inputs until the page gets a click or key event.
