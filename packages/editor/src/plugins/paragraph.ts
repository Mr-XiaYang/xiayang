import { IElement, ParagraphElement } from "../types/element";
import { Plugin } from "../types/plugin";
import { Descendant } from "slate";

function createParagraphPlugin(): Plugin<ParagraphElement> {
  return {
    isElement(element): element is ParagraphElement {
      return element["type"] === "Paragraph";
    },
    isVoid: false,
    isInline: false,
  };
}

