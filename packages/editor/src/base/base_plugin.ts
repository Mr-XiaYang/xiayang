/// <reference path="../type.d.ts"/>
import { ComponentType } from "react";
import { Element, Text } from "slate";
import { ElementProps, LeafProps } from "../interface/component_props";

type PropsType<T extends Element | Text> = T extends Element ? ElementProps<T> : T extends Text ? LeafProps<T> : unknown;

type Options<T extends Element | Text> = {
  customRender?: ComponentType<PropsType<T>>
}

export abstract class BasePlugin<T extends Element | Text> {
  customRender?: ComponentType<PropsType<T>>;

  constructor(options: Options<T>) {
    this.customRender = options.customRender;
  }
}
