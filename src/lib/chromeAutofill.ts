import type { FormControl } from "./models/formControl";
import type { TextElement } from "./models/formControlElement";

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
  if (
    document.getElementById("svelte-use-form-chrome-autofill-styles") === null
  ) {
    const style = document.createElement("style");
    style.setAttribute("id", "svelte-use-form-chrome-autofill-styles");
    style.setAttribute("type", "text/css");
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
}

export function handleChromeAutofill(
  textElement: TextElement,
  control: FormControl,
  callback: Function
) {
  if (!isChrome()) return;

  function handleAnimationStart(event: AnimationEvent) {
    if (event.animationName.includes(animationName)) {
      const currentValue = textElement.value;
      // If chrome did not actually fill the value of the input
      if (!currentValue) {
        control.valid = true;
        callback();
      }
    }
  }

  textElement.addEventListener("animationstart", handleAnimationStart);
  startAnimationWhenAutofilled();
}
