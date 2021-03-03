  <h1>
    <img align="left" height=50 src="svelte-use-form.svg" />
    Svelte Use Form 
  </h1>


A svelte form library that is easy to use and has no boilerplate. It helps you control and validate forms and their fields and check on the state of them.

```bash
npm i -D svelte-use-form
```

#### Features:

- Supports: Inputs, TextAreas, Selects, Radio Buttons, Checkboxes...
- Uses single object to represent the state, instead of splitting it up (errors, values, controls...)
- Requires no special binding on the Form Input Elements, only the name attribute
- OOTB validators and custom validator support
- No requirement to use custom components
- Dynamic Inputs => Show / Hide Inputs at runtime.

## Usage

It's pretty self-explanatory, just check out the examples below 😉<br>
Just make sure to prefix the form with `$`, when accessing its state.

#### REPLs:

- [Registration](https://svelte.dev/repl/a6665267d7d0435ebc7921a250552a25?version=3.34.0)
- [Testing the limits](https://svelte.dev/repl/d4fc021f688d4ad0b3ceb9a1c44c9be9?version=3.34.0)

### Minimal Example [REPL](https://svelte.dev/repl/faf5a9ab763640ed830028c970421f72?version=3.35.0)

```svelte
<script>
  import { useForm, validators, minLength } from "svelte-use-form";

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

or you can also print the error message like this:

```svelte
...
  {#if $form.title?.touched && $form.title?.errors.minLength}
    The title requires at least {$form.title.errors.minLength} characters.
  {/if}
</form>

```

### Login Example (Styling omitted) [REPL](https://svelte.dev/repl/ca967b45a5aa47b2bb2f9118eb79eefe?version=3)

```svelte
<script>
  import { useForm, validators, email, required } from "svelte-use-form";

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

## API

### const form = useForm(properties)

useForm() returns a svelte `store` (Observable) that is also an `action`. (That's what I call [svelte](https://www.dictionary.com/browse/svelte) 😆)<br>

#### properties

``` typescript
interface FormProperties {
  [control: string]: {
    initial?: string;
    validators?: Validator[];
  };
}
```

#### form

Contains an `action` that can be used on a form. It binds the form state to the form element.

#### $form

Subscribe to the form with `$` prefix to access the state of the form. It returns a `Form` instance.

### Form
``` typescript
class Form {
    [formControlName: string]: FormControl;
    get valid(): boolean;
    get touched(): boolean;
    get values(): {
        [formControlName: string]: string;
    };
}
```
- valid: boolean
- touched: boolean
- values: { [formControlName]: value } > Returns an object with the keys and the values being the name of the FormControl and its value.
- `[formcontrol]: FormControl`

Every input in the form will be accessible through the form directly. e.g. `<input name="email" />` === $form.email

### FormControl
```typescript
/** A FormControl represents the state of a form member like (input, textarea...) */
export declare class FormControl {
    validators: Validator[];
    /**
     * Returns an object containing possible ValidationErrors
     * ### Example (All validators are throwing an error)
     * `{ required: true, minLength: 4, maxLength: 20 }`
     * ### Example 2 (Only required is not valid)
     * `{ required: true }`
     */
    errors: {
        [errorName: string]: ValidationErrors;
    };
    /** If the FormControl passed all given validators. */
    valid: boolean;
    /**
     * If the FormControl has been interacted with.
     * (triggered by blur event)
     */
    touched: boolean;
    /** The initial value of the FormControl. Defaults to `""` if not set via `useForm(params)`. */
    readonly initial: string;
    get value(): string;
    set value(value: string);
    /** Validate the FormControl by querying through the given validators. */
    validate(): boolean;
}

```
### validators (Action)

Takes in the validators that should be used on the form control.
e.g.

```svelte
<input name="email" use:validators={[required, email]}>
```

### Hint

Properties:

- for="name_of_input"
- on="error" > the error which should trigger it
- hideWhen="different_error" > hides the hint if the different error is throwing
- hideWhenRequired > shortcut for hideWhen="required"
- showWhenUntouched > hint will get displayed even if the field hasn't been touched yet.
- let:value > returns the value of the error

### HintGroup

Properties:

- for="name_of_input"

You can omit the Hint "name" prop when wrapping it with a HintGroup.

### Validators

- required
- minLength(n)
- maxLength(n)
- number
- email

#### Custom Validator

A validator needs to be a function that returns null if valid else an object with the key being the name of the error. The value of the object will be accessible through the error. e.g. $form.title.errors.name_of_error -> 'info'.

```typescript
function passwordMatch(value: string, form: Form): null | ValidationErrors {
  return value !== form.password.value
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

## Note

### Chrome Autofill

When Chrome autofills the form on page load, it will register all inputs as valid. After clicking anywhere on the site, pressing a key or pressing the submit button it will validate all fields and set the correct state of the form. Note that when the user triggers a submit event, it will not fire if the fields are invalid. This solution was needed due to Chromes way of autofilling forms without really filling the inputs with values, until the page gets a click or key event.
