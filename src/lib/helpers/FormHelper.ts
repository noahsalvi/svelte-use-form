import type { FormControlElement } from '$lib/models/formControlElement';
import type { ValueType } from '$lib/models/formControl';

export function setElementValue(element: FormControlElement, value: ValueType | null) {
    if (!value) return;

    if (element instanceof HTMLSelectElement) {
        if (element.multiple) {
            [...element.options].forEach((option) => {
                option.selected = (value as string[]).includes(option.value);
            });
        } else {
            element.value = value as string;
        }
    } else if (element.type === 'radio' && element instanceof HTMLInputElement) {
        element.checked = element.value === value;
    } else if (
        element.type === 'checkbox' &&
        element instanceof HTMLInputElement
    ) {
        if (value instanceof Array) {
            element.checked = value.includes(element.value);
        } else {
            element.checked = element.value === value;
        }
    } else {
        element.value = value as string;
    }
}

export function getElementValue(element: FormControlElement, allElements: FormControlElement[] = []): ValueType {
    if (element instanceof HTMLSelectElement) {
        if (element.multiple) {
            return [...element.selectedOptions].map((option) => option.value);
        }

        return element.value;
    } else if (element.type === 'radio' && element instanceof HTMLInputElement) {
        return element.checked ? element.value : '';
    } else if (element.type === 'checkbox' && element instanceof HTMLInputElement) {
        return getCheckboxValue(element, allElements);
    } else {
        return element.value;
    }
}


function getCheckboxValue(element: HTMLInputElement, allElements: FormControlElement[]): ValueType {
    const name = element.name;
    const matchingElements =
        allElements.filter(el => el instanceof HTMLInputElement && el.name === name);

    if (matchingElements.length === 1) {
        return element.checked ? element.value : '';
    }

    return matchingElements
        .filter(el => el instanceof HTMLInputElement && el.checked)
        .map(el => el.value);
}
