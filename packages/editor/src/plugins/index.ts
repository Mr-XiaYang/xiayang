import { ParagraphPlugin } from "./paragraph";
import { TitlePlugin } from "./title";

export const defaultPlugins = [
  new ParagraphPlugin(),
  new TitlePlugin(),
];

export * from "./paragraph";
