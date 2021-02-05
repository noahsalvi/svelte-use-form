# Usage

import { useForm, Validators } from "svelte-use-form";
const form = useForm({password: { validators: [Validators.minLength(5)] }})

<form use:form>
    <input name="password">
    {#if $form.password.touched && $form.password.errors.minLength} 
        The password requires at least {$form.password.errors.minLength} characters.
    {/if}
    <button disabled={$form.valid}>
</form>
