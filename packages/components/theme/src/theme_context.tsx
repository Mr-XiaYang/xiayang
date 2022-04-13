import React, { CSSProperties } from "react";
import theme, { Theme } from "./theme";

const ThemeContext = React.createContext<{ theme: Theme }>({theme: theme});

export default ThemeContext;
