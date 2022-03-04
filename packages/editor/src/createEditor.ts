import { ComponentType } from "react";
import { createEditor as createSlate, Editor, Element, Text } from "slate";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import { ElementPlugin } from "./base/element_plugin";
import { LeafPlugin } from "./base/leaf_plugin";

interface Options<E extends Element, T extends Text> {
  plugins: Array<ElementPlugin<E> | LeafPlugin<T>>;
}

export function createEditor<E extends Element, T extends Text>({plugins = []}: Options<E, T>): Editor {
  const editor = withHistory(withReact(createSlate()));
  for (const plugin of plugins) {
    if (plugin instanceof ElementPlugin) {
      const {isVoid, isInline} = editor;
      editor.isVoid = (element) => plugin.isElement(element) ? !!plugin.isVoid : isVoid(element);
      editor.isInline = (element) => plugin.isElement(element) ? !!plugin.isInline : isInline(element);
    }
  }
  return editor;
}
