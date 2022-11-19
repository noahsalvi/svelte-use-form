export function isTextElement(node: any): node is TextElement {
  return (
    node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement
  );
}

export function isFormElement(node: any): node is FormElement {
  return (
    node instanceof HTMLInputElement ||
    node instanceof HTMLTextAreaElement ||
    node instanceof HTMLSelectElement
  );
}

export type TextElement = HTMLInputElement | HTMLTextAreaElement;
export type FormElement = TextElement | HTMLSelectElement;
