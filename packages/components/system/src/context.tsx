import { Jss } from "jss";
import React from "react";
import Theme from "./theme";
import createJss from "./utils/create_jss";

export const JssContext = React.createContext<Jss>(createJss());
JssContext.displayName = "JssContext";

// export const ThemeContext = React.createContext<Theme>(createTheme());
// ThemeContext.displayName = "ThemeContext";

// export interface ThemeProviderProps {
//   theme: Partial<Theme>;
//   children?: React.ReactNode | React.ReactNode[];
// }

// export const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = (props) => {
//   const {theme, children} = props;
//   const fullTheme = React.useMemo<Theme>(() => createTheme(theme), [theme]);
//   return (
//     <ThemeContext.Provider value={fullTheme}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
//
// export const JssProvider: React.FunctionComponent<React.PropsWithChildren<Pick<JssOptions, "id" | "createGenerateId" | "insertionPoint">>> = (props) => {
//   const {id, createGenerateId, insertionPoint, children} = props;
//   const jss = React.useMemo<Jss>(() => createJss({
//     id, createGenerateId, insertionPoint,
//   }), [id, createGenerateId, insertionPoint]);
//   return (
//     <JssContext.Provider value={jss}>
//       {children}
//     </JssContext.Provider>
//   );
// };

export const useJss = (): Jss => React.useContext(JssContext);
// export const useTheme = (): Theme => React.useContext(ThemeContext);


