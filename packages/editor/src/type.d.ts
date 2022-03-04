import { BaseEditor, BaseElement } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

type ElementType = "Paragraph" | "SourceCode" | "Blockquote"
  | "OrderedList" | "UnorderedList" | "HorizontalRule" | "Break"
  | "Title" | "Link" | "InlineCode" | "Italic" | "Bold"

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: { type: string } & BaseElement;
  }
}
