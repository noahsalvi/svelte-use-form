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

export type TextElement = HTMLInputElement | HTMLTextAreaElement;
export type FormControlElement = TextElement | HTMLSelectElement;
