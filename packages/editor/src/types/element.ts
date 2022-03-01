import { BaseElement, Descendant } from "slate";

export type ElementType = "Paragraph" | "SourceCode" | "Blockquote"
  | "OrderedList" | "UnorderedList" | "HorizontalRule" | "Break"
  | "H1" | "H2" | "H3" | "H4" | "H5" | "H6"
  | "Link" | "InlineCode" | "Italic" | "Bold"

export interface IElement extends BaseElement {
  type: ElementType;
  children: Descendant[];
}

export interface ParagraphElement extends IElement {
  type: "Paragraph",
  children: Descendant[]
}

export interface SourceCodeElement extends IElement {
  type: "SourceCode",
  language: string,
  children: Descendant[]
}

export type Element = | ParagraphElement | SourceCodeElement;
