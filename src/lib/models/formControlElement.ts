export function isTextElement(node: any): node is TextElement {
  return (
    node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement
  );
}

export function isFormControlElement(node: any): node is FormControlElement {
  return (
    node instanceof HTMLInputElement ||
    node instanceof HTMLTextAreaElement ||
    node instanceof HTMLSelectElement
  );
}

/* This function checks the node if it has an attribute `data-suf-ignore`
  It's used to ignore elements that should not be part of the form
*/
export function ignoreElement(node: any): boolean {
  return node.hasAttribute('data-suf-ignore');
}

export type TextElement = HTMLInputElement | HTMLTextAreaElement;
export type FormControlElement = TextElement | HTMLSelectElement;
