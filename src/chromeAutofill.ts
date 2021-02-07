import type { FormControl } from "./formControl";
const isChrome = () =>
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
const animationName = "svelte-use-form-webkit-autofill";
const css = `
@keyframes ${animationName} {
    from {}
}

input:-webkit-autofill {
    animation-name: svelte-use-form-webkit-autofill;
}
`;

function startAnimationWhenAutofilled() {
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

export function handleChromeAutofill(
  input: HTMLInputElement,
  control: FormControl,
  callback: Function
) {
  if (!isChrome()) return;

  function handleAnimationStart(event: AnimationEvent) {
    if (event.animationName.includes(animationName)) {
      const currentValue = input.value;
      // If chrome did not actually fill the value of the input
      if (!currentValue) {
        control.valid = true;
        callback();
      }
    }
  }

  input.addEventListener("animationstart", handleAnimationStart);
  startAnimationWhenAutofilled();
}
