import { createContext, useContext, ComponentType } from "react";
import { LeafProps } from "../base/element_plugin";


const customComponentContext = createContext({});
const useCustomComponent = () => {
  return useContext(customComponentContext);
};
