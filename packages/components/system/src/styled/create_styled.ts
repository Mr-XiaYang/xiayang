import hoistNonReactStatics from "hoist-non-react-statics";
import { getDynamicStyles, Jss, JssStyle, Styles, StyleSheet } from "jss";
import React from "react";
import { jss } from "../context/jss";
import { Theme, useTheme } from "../context/theme";
import classnames from "../utils/classnames";
import getComponentName from "../utils/get_component_name";
import { getSeparatedStyles } from "./get_separated_styles";

type StyledProps = {
  ref?: unknown,
  className?: string,
  children?: React.ReactNode | React.ReactNode[]
}
type StyleComponent<Props extends object = {}> =
  | keyof JSX.IntrinsicElements
  | (React.ComponentType<Props> & { style?: Styles<string, Props, Theme> })

function getParamsByComponent<P extends object>(component: StyleComponent<P>): { component: StyleComponent<P>; tagName: string; style?: Styles<string, P, Theme> } {
  if (typeof component === "string") {
    return {tagName: component, component: component};
  } else {
    return {tagName: getComponentName(component, "StyledComponent"), component, style: component.style};
  }
}

function defaultGenerateId(sheet: StyleSheet, name: string): string {
  return name;
}

interface CreateStyledOptions {
  generateId?: typeof defaultGenerateId;
}

export function createStyled(jss: Jss, options: CreateStyledOptions = {}) {
  const generateId = options?.generateId ?? defaultGenerateId;
  return function Styled<P extends StyledProps, R>(component: StyleComponent<P>) {
    const {component: element, tagName, style} = getParamsByComponent(component);
    const sheet: StyleSheet = jss.createStyleSheet({}, {
      link: true, meta: `styled-${tagName}`,
    });
    return function styles(...componentStyles: JssStyle<P, Theme>[]) {
      const styles = [style, ...componentStyles].filter(Boolean) as JssStyle<P, Theme>[];
      const {staticStyle, dynamicStyle, functionStyle} = getSeparatedStyles<P, Theme>(styles);
      const staticStyleName = staticStyle != null ? generateId(sheet, tagName) : null;
      const dynamicStyleName = dynamicStyle != null ? generateId(sheet, tagName) : null;
      const functionStyleName = functionStyle != null ? generateId(sheet, tagName) : null;
      console.log(staticStyleName, dynamicStyleName, functionStyleName, sheet.classes);
      const styledComponent = React.forwardRef<P["ref"], React.PropsWithoutRef<P>>((props, ref) => {
        const {className, children, ...otherProps} = props;
        const theme = useTheme();

        React.useEffect(() => {
          !sheet.attached && sheet.attach();

          sheet.update({theme, ...props});
        }, []);

        const styledClassName = classnames(
          className,
          staticStyleName && sheet.classes[staticStyleName],
          dynamicStyleName && sheet.classes[dynamicStyleName],
          functionStyleName && sheet.classes[functionStyleName],
        );

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
