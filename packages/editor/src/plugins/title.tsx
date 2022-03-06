import { Descendant, Element } from "slate";
import { ElementPlugin } from "../interface/plugin";
import { ElementProps } from "../interface/component_props";

export interface TitleElement extends Element {
  type: "Title",
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: Descendant[]
}

export class TitlePlugin extends ElementPlugin<TitleElement> {
  readonly isVoid = false;
  readonly isInline = false;

  isElement(element: Element): element is TitleElement {
    return element.type === "Title";
  }

  renderElement(props: ElementProps<TitleElement>) {
    return (
      <h1>{props.children}</h1>
    );
  };
}

