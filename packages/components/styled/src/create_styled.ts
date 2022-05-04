import { useTheme } from "@xiayang/theme";
import { classnames, getComponentName } from "@xiayang/utils";
import hoistNonReactStatics from "hoist-non-react-statics";
import { Jss, JssStyle, StyleSheet } from "jss";
import { Component, ComponentType, createElement, forwardRef, ReactNode,Ref } from "react";
import getSeparatedStyles from "./get_separated_styles";
import { Style } from "./type";

type StyledProps = {
  ref?: Ref<any>
  className?: string,
  children?: ReactNode | ReactNode[]
}
type StyleComponent<P = any, T = undefined> =
  | keyof JSX.IntrinsicElements
  | (ComponentType<P> & { style?: Style<P, T> })

type PropsRef<T> = T extends Ref<infer R> ? R : T;

function getParamsByComponent<P = any, T = undefined>(
  component: StyleComponent<P, T>, defaultTagName: string = "unknown",
): { component?: ComponentType<P>; tagName: string; style?: Style<P, T> } {
  return typeof component === "string" ? {
    tagName: component
  } : {
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
  shouldForwardProp?: (props:string) => boolean
  generateId?: typeof defaultGenerateId;
}

function createStyled(jss: Jss) {
  return function Styled<P extends StyledProps, T = undefined>(component: StyleComponent<P>, options: StyledOptions = {}) {
    const generateId = options?.generateId ?? defaultGenerateId;
    const {component: element, tagName, style} = Object.assign(
      getParamsByComponent(component, options.tagName),
      options.tagName ? {tagName: options.tagName} : {}
    );
    const sheet: StyleSheet = jss.createStyleSheet({}, {link: true, meta: `styled-${tagName}`});

    return function styles(...componentStyles: Style<P, T>[]) {
      const styles = [style, ...componentStyles].filter(Boolean) as JssStyle<P, T>[];
      const {staticStyle, dynamicStyle, functionStyle} = getSeparatedStyles<P, T>(styles);

      const staticStyleName: string | undefined = !!staticStyle ? generateId(tagName) : undefined;
      const availableStyleNames: string[] = [];

      class StyledComponent extends Component<P & { forwardRef?: any, theme?: T }> {
        static displayName?: string;

        readonly staticStyleName?: string;
        readonly dynamicStyleName?: string;
        readonly functionStyleName?: string;

        constructor(props: P) {
          super(props);
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
          this.updateSheet(props);
          !sheet.attached && sheet.attach();
        }

        componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<{}>, snapshot?: any) {
          if (this.props != prevProps) {
            this.updateSheet(this.props);
          }
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

        updateSheet(props: P) {
          this.dynamicStyleName && sheet.update(this.dynamicStyleName, props);
          this.functionStyleName && sheet.update(this.functionStyleName, props);
        }

        render() {
          const {forwardRef, className, children, ...otherProps} = this.props;
          const styledClassName = classnames(
            this.staticStyleName && sheet.classes[this.staticStyleName],
            this.dynamicStyleName && sheet.classes[this.dynamicStyleName],
            this.functionStyleName && sheet.classes[this.functionStyleName],
            className,
          );
          return createElement(element || tagName, {
            className: styledClassName, ref: forwardRef, ...otherProps,
          } as unknown as P, children);
        }
      }

      const ForwardRefComponent = forwardRef<PropsRef<P['ref']>, Omit<P, "ref"|"theme">>((props, ref) => {
        const theme = useTheme();
        return createElement(StyledComponent, {forwardRef: ref, theme: theme, ...props} as unknown as any);
      });

      if (typeof component != "string") {
        hoistNonReactStatics(ForwardRefComponent, component);
      }
      if (process.env.NODE_ENV !== "production") {
        if(element!=null) {
          element.displayName = `Inner(${tagName}))`
        };
        StyledComponent.displayName = `Styled(${tagName})`;
        ForwardRefComponent.displayName = `ForwardRef(${tagName})`;
      }
      return ForwardRefComponent;
    };
  };
}

export default createStyled;
