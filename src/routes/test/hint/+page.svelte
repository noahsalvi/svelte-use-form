<script lang="ts">
    import { email, Hint, required, useForm, validators } from "$lib";

    const form = useForm();
</script>

<form use:form>
    <input type="text" name="email" use:validators={[required, email]}>
    <Hint for="email" on="required">Required</Hint>
    <Hint for="email" on="email">
        Email
    </Hint>
    <Hint for="email" on="non-existent">Non-existent</Hint>
</form>