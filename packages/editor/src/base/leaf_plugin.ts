import { Text } from "slate";
import { LeafProps } from "../interface/component_props";
import { BasePlugin } from "./base_plugin";

export abstract class LeafPlugin<T extends Text> extends BasePlugin<T> {
  abstract renderLeaf(props: LeafProps<T>): JSX.Element;
}
