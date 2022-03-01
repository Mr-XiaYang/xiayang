import React from "react";
import { BaseEditor, Element, createEditor as createSlate } from "slate";
import { ReactEditor, withReact } from "slate-react";
import { HistoryEditor, withHistory } from "slate-history";
import { IElement } from "./types/element";
import { Plugin } from "./types/plugin";

interface Options {
  plugins: Plugin<IElement>[];
}

export function createEditor({plugins = []}: Options) {
  const editor = withHistory(withReact(createSlate() as ReactEditor));
  for (const plugin of plugins) {
    const {isVoid, isInline} = editor;
    editor.isVoid = (element) => plugin.isElement(element) ? !!plugin.isVoid : isVoid(element);
    editor.isInline = (element) => plugin.isElement(element) ? !!plugin.isInline : isInline(element);
  }
  return editor;
}
