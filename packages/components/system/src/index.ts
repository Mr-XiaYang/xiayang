import { jss } from "./context/jss";
import { createStyled } from "./styled";

export { JssProvider, withJss, useJss, createJss } from "./context/jss";
export const styled = createStyled(jss);
