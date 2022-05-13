import { createHOCByContext, createHookByContext, createProviderByContext } from "@xiayang/utils";
import React from "react";

export interface Theme {

}

export const createTheme = (): Theme => {
  return {};
};

export const theme = createTheme();
export const ThemeContext = React.createContext<Theme>(theme);
export const ThemeProvide = createProviderByContext(ThemeContext, "theme");
export const withTheme = createHOCByContext(ThemeContext, "theme", "theme");
export const useTheme = createHookByContext(ThemeContext, "theme");

if (process.env.NODE_ENV !== "production") {
  ThemeContext.displayName = "ThemeContext";
}
