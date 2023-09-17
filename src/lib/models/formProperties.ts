import type { ErrorMap, Validator } from './validator';

export type FormProperties = {
    [key: string]: SingleValueFormProperty | MultiValueFormProperty;
};

export type SingleValueFormProperty = {
    initial?: string;
    validators?: Validator<string>[];
    multiple?: false | undefined;
    errorMap?: ErrorMap;
}

export type MultiValueFormProperty = {
    initial?: string[];
    validators?: Validator<string[]>[];
    multiple: true;
    errorMap?: ErrorMap;
}

export type SingleValueKeys<T extends FormProperties> = {
    [K in keyof T]: T[K] extends SingleValueFormProperty ? K : never;
}[keyof T];

export type MultipleValueKeys<T extends FormProperties> = {
    [K in keyof T]: T[K] extends MultiValueFormProperty ? K : never;
}[keyof T];
