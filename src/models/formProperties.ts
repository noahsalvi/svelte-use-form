import type { Validator } from "../validators";

export interface FormProperties {
  [control: string]: {
    initial?: string;
    validators?: Validator[];
  };
}
