import { Element, Text } from "slate";
import { ElementProps } from "../interface/component_props";
import { BasePlugin } from "./base_plugin";

export abstract class ElementPlugin<T extends Element> extends BasePlugin<T> {
  abstract isVoid?: boolean;
  abstract isInline?: boolean;

  abstract isElement(element: Element): element is T;

  abstract renderElement(props: ElementProps<T>): JSX.Element;
}
