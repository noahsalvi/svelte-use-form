import type { Validator } from "./validator";

export interface FormProperties {
  [control: string]: {
    initial?: string;
    validators?: Validator[];
  };
}
