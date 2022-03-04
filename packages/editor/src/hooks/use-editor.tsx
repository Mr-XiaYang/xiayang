import { ComponentType, createContext, useContext } from "react";
import { Editor, Text } from "slate";
import { createEditor } from "../createEditor";
import { defaultPlugins, ParagraphElement } from "../plugins";
import { TitleElement } from "../plugins/title";

export const EditorContext = createContext(createEditor<ParagraphElement | TitleElement, Text>({
  plugins: defaultPlugins,
}));

export const useEditor = (): Editor => useContext(EditorContext);
