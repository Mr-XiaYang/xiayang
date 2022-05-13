import { Properties as CSSProperties } from "csstype";
import { jss } from "./context/jss";
import createStyled from "./create_styled";

export { JssProvider, withJss, useJss, createJss } from "./context/jss";
export { default as createStyled } from "./create_styled";
export { default as createStyleHook } from "./create_style_hook";
export const styled = createStyled(jss);
