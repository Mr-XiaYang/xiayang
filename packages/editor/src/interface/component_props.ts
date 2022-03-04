import { Element, Text } from "slate";

export interface ElementProps<T extends Element> {
  children: any;
  element: T;
  attributes: {
    "data-slate-node": "element";
    "data-slate-inline"?: true;
    "data-slate-void"?: true;
    dir?: "rtl";
    ref: any;
  };
}

export interface LeafProps<T extends Text> {
  children: any;
  leaf: T;
  attributes: {
    "data-slate-leaf": true;
  };
}
