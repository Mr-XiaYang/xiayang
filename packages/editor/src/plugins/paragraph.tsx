import { createElement } from "react";
import { Descendant, Element } from "slate";
import { ElementPlugin } from "../base/element_plugin";
import { ElementProps } from "../interface/component_props";

export interface ParagraphElement extends Element {
  type: "Paragraph",
  children: Descendant[]
}

export class ParagraphPlugin extends ElementPlugin<ParagraphElement> {
  readonly isVoid = false;
  readonly isInline = false;

  isElement(element: Element): element is ParagraphElement {
    return element.type === "Paragraph";
  }

  renderElement(props: ElementProps<ParagraphElement>) {
    if (this.customRender != null) {
      return createElement(this.customRender, props);
    } else {
      const {attributes, children} = props;
      return (
        <div {...attributes}>{children}</div>
      );
    }
  };
}

