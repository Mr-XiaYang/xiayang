/// <reference path="../type.d.ts"/>

import { ComponentType } from "react";
import { Element, Text } from "slate";
import { ElementProps, LeafProps } from "./component_props";

type PropsType<T extends Element | Text> = T extends Element ? ElementProps<T> : T extends Text ? LeafProps<T> : unknown;

type Options<T extends Element | Text> = {
  customRender?: ComponentType<PropsType<T>>
}

export abstract class BasePlugin<T extends Element | Text> {
  customRender?: ComponentType<PropsType<T>>;

  constructor(options: Options<T> = {}) {
    this.customRender = options.customRender;
  }
}

export abstract class ElementPlugin<T extends Element> extends BasePlugin<T> {
  abstract isVoid?: boolean;
  abstract isInline?: boolean;

  abstract isElement(element: Element): element is T;

  abstract renderElement(props: ElementProps<T>): JSX.Element;
}

export abstract class LeafPlugin<T extends Text> extends BasePlugin<T> {
  abstract renderLeaf(props: LeafProps<T>): JSX.Element;
}

export type Plugin = LeafPlugin<Text>| ElementPlugin<Element>;
