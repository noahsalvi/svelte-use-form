  <h1>
    <img align="left" height=40 src="svelte-use-form.svg" />
    &nbsp;
    <span align="left">Svelte Use Form</span>
  </h1>

A svelte form library that is easy to use and has no boilerplate. It lets you create and control complicated forms with ease. Like svelte, the focus is **DX** 💻‍✨

```bash
npm i -D svelte-use-form
```

<a href="https://npmjs.com/package/svelte-use-form">![GitHub package.json version](https://img.shields.io/github/package-json/v/noahsalvi/svelte-use-form?style=for-the-badge)</a>
<a href="https://npmjs.com/package/svelte-use-form">![npm](https://img.shields.io/npm/dw/svelte-use-form?style=for-the-badge)</a>

**Features:**

- Minimalistic approach. Don't write more than necessary. 😘
- No new components, bindings or callbacks required! ✅
- OOTB validators and custom validator support ✅
- Works with dynamic inputs => Show / Hide Inputs at runtime. ✅
- Type inference [TS] ✅

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

**Login Example (Styling omitted)** [REPL](https://svelte.dev/repl/ca967b45a5aa47b2bb2f9118eb79eefe?version=3)

```svelte
<script>
  import { useForm, HintGroup, Hint, validators, email, required } from "svelte-use-form";

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

## More Examples

**REPLs:**

- [Registration](https://svelte.dev/repl/a6665267d7d0435ebc7921a250552a25?version=3.34.0)
- [Testing the limits](https://svelte.dev/repl/d4fc021f688d4ad0b3ceb9a1c44c9be9?version=3.34.0)

# API

## `useForm(FormProperties | null)`

useForm() returns a svelte `store` (Observable) that is also an `action`. (That's what I call [svelte](https://www.dictionary.com/browse/svelte) 😆)

### Why specify `FormProperties`?

Providing the names of the properties as arguments allows us to initialize all form controls in the form before the site is actually rendered. Thus you won't need to null-check them when accessing them.

```svelte
const form = useForm({ firstName: {} });
$form.firstName // Works as expected
$form?.lastName // lastName would be null on page load
```

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
Every control in the form will be accessible through $form directly via the name attribute.

e.g. `<input name="email" />` --> `$form.email`

````typescript
export declare class FormControl {
  validators: Validator[];
  /**
   * Returns an object containing possible validation errors
   * @example
   * (All validators are throwing an error)
   * `{ required: true, minLength: 4, maxLength: 20 }`
   * (Only required is invalid)
   * `{ required: true }`
   */
  errors: ValidationErrors;
  /**
   * Contains a map of values, that will be shown
   * in place of the original validation error.
   */
  errorMap: ErrorMap;
  /**
   * The DOM elements representing this control
   */
  elements: FormControlElement[];
  /** Does the FormControl pass all given validators? */
  valid: boolean;
  /**
   * If the FormControl has been interacted with.
   * (triggered by blur event)
   */
  _touched: boolean;
  /** The initial value of the FormControl. Defaults to `""` if not set via `useForm(params)`. */
  initial: string;
  private readonly formRef;
  private _value;
  get value(): string;
  get touched(): boolean;
  /**
   * This will only change the internal value of the control, not the one displayed in the actual HTML-Element
   *
   * See `change(value: String)` for doing both
   */
  set value(value: string);
  set touched(value: boolean);
  constructor(formControl: {
    value: string;
    validators: Validator[];
    errorMap: ErrorMap;
    elements: FormControlElement[];
    formRef: () => Form<any>;
  });
  /**
   * Set an error manually.
   *
   * The error will be removed after changes to the value or on validate()
   *
   * Used for setting an error that would be difficult to implement with a validator.
   * @example Backend Response returning Login failed
   * ``` typescript
   * function submit() {
   *    apiLogin($form.values).then(response => {})
   *    .catch(error => {
   *        if (error.status === 403) {
   *            $form.password.error({ login: "Password or username is incorrect" });
   *        }
   *    })
   * }
   * ```
   */
  error(errors: ValidationErrors): void;
  /** Change the value and the value of all HTML-Elements associated with this control */
  change(value: any): void;
  /** Validate the FormControl by querying through the given validators. */
  validate(): boolean;
  /** Reset the form control value to its initial value or `{ value }` and untouch it */
  reset({ value }?: { value?: string | null }): void;
}
````

## `use:validators` (Action)

Takes in the validators that should be used on the form control.
e.g.

```svelte
<input name="email" use:validators={[required, email]}>
```

## `<Hint></Hint>`

Helper component for displaying information based on errors in an input.

Properties:

- `for="name_of_input"`
- `on="error"` the error which should trigger it
- `hideWhen="different_error"` hides the hint if the different error is throwing
- `hideWhenRequired` shortcut for hideWhen="required"
- `showWhenUntouched` hint will get displayed even if the field hasn't been touched yet.
- `let:value` returns the value of the error

## `<HintGroup><Hint></Hint></HintGroup>`

You can omit the Hint `name` prop when wrapping it with a HintGroup.

Properties:

- `for="name_of_input"`

## Validators

- `required`
- `minLength(n)`
- `maxLength(n)`
- `number`
- `email`
- `url`

### Custom Validator

A validator needs to be a function that returns null if valid else an object with the key being the name of the error. The value of the object will be accessible through the error. e.g. $form.title.errors.name_of_error -> 'info'.

```typescript
function passwordMatch(value: string, form: Form): null | ValidationErrors {
  return value === form.password.value
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

