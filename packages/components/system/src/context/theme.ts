// import Theme, { Breakpoints, Colors, FontSizes, Space } from "../theme";
//
// const breakpoints: Breakpoints = {xs: "480px", sm: "640px", md: "768px", lg: "1024px", xl: "1280px"};
// const space: Space = [0, 1, 4, 8, 12, 16, 20, 24, 28, 32, 36, 48, 56, 64, 80, 96, 112, 128, 144, 192, 256, 320, 384];
// const fontSizes: FontSizes = {
//   0: "0.75rem", 1: "0.875rem", 2: "1rem", 3: "1.125rem", 4: "1.25rem", 5: "1.5rem",
//   6: "1.875rem", 7: "2.25rem", 8: "3rem", 9: "3.75rem", 10: "4.5rem", 11: "6rem", 12: "8rem",
//   xs: "0.75rem", sm: "0.875rem", md: "1rem", lg: "1.125rem", xl: "1.25rem",
// };
// const colors: Colors = {
//   white: "#f9fafb", black: "#14141B",
//   grey: "#767c89", greys: ["#d4d7dd", "#767c89", "#3f4754"],
//   red: "#e53e3e", reds: ["#fc8181", "#e53e3e", "#c53030"],
//   green: "#48bb78", greens: ["#9ae6b4", "#48bb78", "#2f855a"],
//   blue: "#4299e1", blues: ["#63b3ed", "#4299e1", "#3182ce"],
//   pink: "#ed64a6", pinks: ["#fbb6ce", "#ed64a6", "#d53f8c"],
//   purple: "#805ad5", purples: ["#b794f4", "#805ad5", "#6b46c1"],
//   teal: "#38b2ac", teals: ["#81e6d9", "#38b2ac", "#2c7a7b"],
//   yellow: "#ecc94b", yellows: ["#faf089", "#ecc94b", "#d69e2e"],
//   orange: "#ff9800", oranges: ["#fbd38d", "#ff9800", "#dd6b20"],
//   brown: "#795548", browns: ["#a1887f", "#795548", "#5d4037"],
// };
//
// export function createTheme(theme?: Partial<Theme>): Theme {
//   return {
//     fontSizes: theme?.fontSizes ?? fontSizes,
//     colors: theme?.colors ?? colors,
//     space: theme?.space ?? space,
//     breakpoints: theme?.breakpoints ?? breakpoints,
//   };
// }
//
// export default createTheme;
import React from "react";
import createHocByContext from "../utils/create_hoc_by_context";
import createHookByContext from "../utils/create_hook_by_context";
import createProviderByContext from "../utils/create_provider_by_context";

export interface Theme {

}

export const createTheme = (): Theme => {
  return {};
};

export const theme = createTheme();
export const ThemeContext = React.createContext<Theme>(theme);
export const ThemeProvide = createProviderByContext(ThemeContext, "theme");
export const withTheme = createHocByContext(ThemeContext, "theme", "theme");
export const useTheme = createHookByContext(ThemeContext, "theme");

if (process.env.NODE_ENV !== "production") {
  ThemeContext.displayName = "ThemeContext";
}
