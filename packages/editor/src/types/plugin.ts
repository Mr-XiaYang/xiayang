import { ComponentType } from "react";
import { BaseElement } from "slate";
import { ElementType, IElement } from "./element";

export interface Plugin<T extends IElement> {
  isElement(element: BaseElement): element is T;

  isVoid?: boolean;

  isInline?: boolean;

}
