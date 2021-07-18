<script lang="ts">
  import { useForm, required, email, minLength } from "svelte-use-form";

  const form = useForm({
    email: { validators: [required, email] },
    password: { validators: [required, minLength(5)] },
  });

  function validator(node, validators) {
    const name = node["name"];
    console.log(name);

    console.log(node.validators);

    const sub = form.subscribe((form) => {
      const formControl = form[name];
      if (formControl) {
        formControl.validators = validators;
        console.log("test");
      }
    });

    return {
      destroy: sub?.unsubscribe,
    };

    // $form[name].validators.push(...validators);
  }
</script>

<form use:form>
  <input type="email" name="email" autocomplete="email" />
  <br />
  <input type="password" name="password" autocomplete="current-password" />
  <button>submit</button>
</form>
<pre>
  {JSON.stringify($form)}
</pre>

<style>
  :invalid {
    border: 2px solid red;
  }
</style>
