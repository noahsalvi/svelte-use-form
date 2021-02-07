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
    animation-delay: 100ms;
}
`;

function addAnimationTriggerToAutofill() {
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

export function handleChromeAutofill(
  input: HTMLElement,
  control: FormControl,
  callback: Function
) {
  if (!isChrome()) return;
  addAnimationTriggerToAutofill();

  const initialValue = control.value;
  input.addEventListener("animationstart", handleAnimationStart);
  function handleAnimationStart(event: AnimationEvent) {
    if (event.animationName.includes(animationName)) {
      const newValue = control.value;
      if (initialValue == newValue) {
        control.valid = true;
        callback();
      }
    }
  }
}
