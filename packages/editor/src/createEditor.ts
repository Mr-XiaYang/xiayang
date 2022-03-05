import { ComponentType } from "react";
import { createEditor as createSlate, Editor, Element, Text } from "slate";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import { BasePlugin } from "./base/base_plugin";
import { ElementPlugin } from "./base/element_plugin";
import { LeafPlugin } from "./base/leaf_plugin";

interface Options<T extends Element | Text> {
  plugins?: Array<BasePlugin<T>>;
}

export function createEditor(options: Options<any> = {}): Editor {
  const {plugins} = options;
  const editor = withHistory(withReact(createSlate()));
  if (plugins != null) {
    for (const plugin of plugins) {
      if (plugin instanceof LeafPlugin) {

      }
      if (plugin instanceof ElementPlugin) {
        const {isVoid, isInline} = editor;
        editor.isVoid = (element) => plugin.isElement(element) ? !!plugin.isVoid : isVoid(element);
        editor.isInline = (element) => plugin.isElement(element) ? !!plugin.isInline : isInline(element);
      }
    }
  }
  return editor;
}
