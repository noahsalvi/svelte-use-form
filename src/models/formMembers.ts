export type TextElement = HTMLInputElement | HTMLTextAreaElement;
export type FormMember = TextElement | HTMLSelectElement;

export function isTextElement(node): node is TextElement {
  return (
    node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement
  );
}

export function isFormMember(node): node is FormMember {
  return (
    node instanceof HTMLInputElement ||
    node instanceof HTMLTextAreaElement ||
    node instanceof HTMLSelectElement
  );
}
