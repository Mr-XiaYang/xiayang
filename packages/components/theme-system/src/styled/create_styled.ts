import hoistNonReactStatics from "hoist-non-react-statics";
import { Jss, JssStyle, StyleSheet } from "jss";
import { Component, ComponentClass, ComponentType, createElement, ReactNode } from "react";
import { ThemeContext } from "../context/theme";
import classnames from "../utils/classnames";
import getComponentName from "../utils/get_component_name";
import getSeparatedStyles from "./get_separated_styles";
import { Style } from "./type";

type StyledProps = {
  ref?: unknown,
  className?: string,
  children?: ReactNode | ReactNode[]
}
type StyleComponent<P = any, T = undefined> =
  | keyof JSX.IntrinsicElements
  | (ComponentType<P> & { style?: Style<P, T> })

function getParamsByComponent<P = any, T = undefined>(
  component: StyleComponent<P, T>, defaultTagName: string = "styled",
): { component?: ComponentType<P>; tagName: string; style?: Style<P, T> } {
  return typeof component === "string" ? {tagName: component} : {
    tagName: getComponentName(component, defaultTagName),
    component, style: component.style,
  };
}

let counter = 0;

function defaultGenerateId(tagName: string) {
  return `${tagName}_${(++counter).toString(16)}`;
}

export interface StyledOptions {
  tagName?: string;
  generateId?: typeof defaultGenerateId;
}

function createStyled(jss: Jss) {
  return function Styled<P extends StyledProps, T = undefined>(component: StyleComponent<P>, options: StyledOptions = {}) {
    const generateId = options?.generateId ?? defaultGenerateId;

    const {component: element, tagName, style} = getParamsByComponent(component, options.tagName);
    const sheet: StyleSheet = jss.createStyleSheet({}, {link: true, meta: `styled-${tagName}`});

    return function styles(...componentStyles: Style<P, T>[]): ComponentClass<P> {
      const styles = [style, ...componentStyles].filter(Boolean) as JssStyle<P, T>[];
      const {staticStyle, dynamicStyle, functionStyle} = getSeparatedStyles<P, T>(styles);

      const staticStyleName: string | undefined = !!staticStyle ? generateId(tagName) : undefined;
      const availableStyleNames: string[] = [];

      class StyledComponent extends Component<P> {
        static displayName?: string;
        static contextType = ThemeContext;

        declare readonly context: T;
        readonly staticStyleName?: string;
        readonly dynamicStyleName?: string;
        readonly functionStyleName?: string;

        constructor(props: P, context: T) {
          super(props, context);
          if (!!staticStyle) {
            this.staticStyleName = staticStyleName;
            if (!sheet.getRule(this.staticStyleName!)) {
              sheet.addRule(this.staticStyleName!, staticStyle);
            }
          }
          if (!!dynamicStyle) {
            this.dynamicStyleName = availableStyleNames.pop() || generateId(tagName);
            if (!sheet.getRule(this.dynamicStyleName!)) {
              sheet.addRule(this.dynamicStyleName!, dynamicStyle);
            }
          }
          if (!!functionStyle) {
            this.functionStyleName = availableStyleNames.pop() || generateId(tagName);
            if (!sheet.getRule(this.functionStyleName!)) {
              sheet.addRule(this.functionStyleName!, functionStyle as unknown as JssStyle);
            }
          }
          this.updateSheet(props, context);
          !sheet.attached && sheet.attach();
        }

        componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<{}>, snapshot?: any) {
          this.updateSheet(this.props, this.context);
        }

        componentWillUnmount() {
          if (this.dynamicStyleName) {
            sheet.deleteRule(this.dynamicStyleName);
            availableStyleNames.push(this.dynamicStyleName);
          }
          if (this.functionStyleName) {
            sheet.deleteRule(this.functionStyleName);
            availableStyleNames.push(this.functionStyleName);
          }
        }

        updateSheet(props: P, theme: T) {
          const styledProps = Object.assign({}, {theme}, props);
          this.dynamicStyleName && sheet.update(this.dynamicStyleName, styledProps);
          this.functionStyleName && sheet.update(this.functionStyleName, styledProps);
        }

        render() {
          const {className, children, ...otherProps} = this.props;
          const styledClassName = classnames(
            this.staticStyleName && sheet.classes[this.staticStyleName],
            this.dynamicStyleName && sheet.classes[this.dynamicStyleName],
            this.functionStyleName && sheet.classes[this.functionStyleName],
            className,
          );
          return createElement(element || tagName, {
            className: styledClassName, ...otherProps, theme: this.context,
          } as unknown as P, children);
        }
      }

      if (typeof component != "string") {
        hoistNonReactStatics(StyledComponent, component);
      }
      if (process.env.NODE_ENV !== "production") {
        StyledComponent.displayName = `styled(${tagName})`;
      }
      return StyledComponent;
    };
  };
}

export default createStyled;
