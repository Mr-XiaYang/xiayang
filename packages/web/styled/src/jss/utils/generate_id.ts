import type JssSheet from "../jss_sheet";

export interface GenerateIdOptions {
  minify?: boolean;
}

export type GenerateId = (sheet: JssSheet, options: GenerateIdOptions) => string;

export const defaultGenerateId: GenerateId = () => {
  return "";
};
