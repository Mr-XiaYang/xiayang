import { jss } from "./context/jss";
import { createStyled } from "./styled";

export { JssProvider, withJss, useJss, createJss } from "./context/jss";
export { ThemeProvide, withTheme, useTheme, createTheme } from "./context/theme";
export type { Theme } from "./context/theme";
export const styled = createStyled(jss);
