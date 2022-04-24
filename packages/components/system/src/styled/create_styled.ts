import hoistNonReactStatics from "hoist-non-react-statics";
import { getDynamicStyles, Jss, Styles } from "jss";
import React, { PropsWithChildren, PropsWithoutRef, PropsWithRef, useEffect } from "react";
import { jss, useJss } from "../context/jss";
import { Theme, useTheme } from "../context/theme";
import classnames from "../utils/classnames";
import getComponentName from "../utils/get_component_name";
import Styled from "./index";

type StyledProps = {
  ref?: unknown,
  className?: string,
  children?: React.ReactNode | React.ReactNode[]
}
type StyleComponent<Props extends object = {}> =
  (React.ComponentType<Props> & { style?: Styles<string, Props, Theme> })
  | keyof JSX.IntrinsicElements

function getParamsByComponent<P extends object>(component: StyleComponent<P>): { component: StyleComponent<P>; tagName: string; style?: Styles<string, P, Theme> } {
  if (typeof component === "string") {
    return {tagName: component, component: component};
  } else {
    return {tagName: getComponentName(component, "StyledComponent"), component, style: component.style};
  }
}

//
// function separated<Props>(styles: Styles<string, Props, Theme>) {
//   const separatedStyles: { staticStyles?: object, dynamicStyles?: object } = {};
//   for (const [key, value] of Object.entries(styles)) {
//     if (value != null) {
//       if (typeof value === "function") {
//         separatedStyles.dynamicStyles = {...separatedStyles.dynamicStyles, [key]: value};
//       } else if (typeof value === "object" && value.toString === Object.prototype.toString) {
//         const {staticStyles, dynamicStyles} = separated(value);
//         separatedStyles.dynamicStyles = {...separatedStyles.dynamicStyles, [key]: dynamicStyles};
//         separatedStyles.staticStyles = {...separatedStyles.staticStyles, [key]: staticStyles};
//       } else {
//         separatedStyles.staticStyles = {...separatedStyles.staticStyles, [key]: value};
//       }
//     }
//   }
//   return separatedStyles;
// }
//
// function getSeparatedStyles<Props>(initialStyles: Styles<string, Props, Theme>[]) {
//   const styles = {};
//   const fns: Array<Function> = [];
//
//   for (const style of initialStyles) {
//     if (typeof style === "function") {
//       fns.push(style);
//     } else {
//       Object.assign(styles, style);
//     }
//   }
//
//   const separatedStyles = separated(styles);
//   if (fns.length > 0) {
//     const {dynamicStyles} = separatedStyles;
//     separatedStyles.dynamicStyles = (props: object) => {
//       const fnResults = fns.map(fn => fn(props));
//       const dynamicResult = {};
//
//
//       return Object.assign(...fnResults);
//     };
//   }
// }


let sheetCounter = 0;

export function createStyled(jss: Jss) {
  return function Styled<P extends StyledProps, R>(component: StyleComponent<P>, options?: { sheetName?: string }) {
    const {component: element, tagName, style} = getParamsByComponent(component);
    const sheet = jss.createStyleSheet({}, {
      link: true, meta: options?.sheetName ?? `styled(${tagName}):${++sheetCounter}`,
    });
    return function styles(...componentStyles: Styles<string, P, Theme>[]) {
      const styles: Styles<string, P, Theme>[] = [style ?? {}].concat(componentStyles).filter(Boolean);
      const staticStyles = {};
      const dynamicStylesList = [];
      for (const style of styles) {
        const dynamicStyles = getDynamicStyles(style as Styles);
        if (dynamicStyles === null) {
          Object.assign(staticStyles, style);
        } else {
          dynamicStylesList.push(dynamicStyles);
        }
      }
      const rules = sheet.addRules(staticStyles);
      console.log(rules);
      const styledComponent = React.forwardRef<P["ref"], React.PropsWithoutRef<P>>((props, ref) => {
        const {className, children, ...otherProps} = props;
        const theme = useTheme();

        useEffect(() => {
          !sheet.attached && sheet.attach();
          sheet.update({theme, ...props});
        }, []);

        const styledClassName = classnames(className);
        return React.createElement(element, {
          ...otherProps, ref, className: styledClassName,
        } as unknown as P, children);
      });
      if (typeof component != "string") {
        hoistNonReactStatics(styledComponent, component);
      }
      if (process.env.NODE_ENV !== "production") {
        styledComponent.displayName = `styled(${tagName})`;
      }
      return styledComponent;
    };
  };
}

export default createStyled(jss);
