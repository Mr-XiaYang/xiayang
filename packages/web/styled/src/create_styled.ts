import { useTheme } from "@xiayang/theme";
import { classnames, getComponentName, hoistNonReactStatics } from "@xiayang/utils";
import { Jss, JssStyle, StyleSheet } from "jss";
import { Component, ComponentType, createElement, forwardRef, ReactNode, Ref } from "react";
import { Style } from "./type";
import getSeparatedStyles from "./utils/get_separated_styles";
import isValidProp from "./utils/is_valid_prop";

type StyledProps = {
  ref?: Ref<any>
  className?: string,
  children?: ReactNode | ReactNode[]
}
type StyleComponent<P = any, T = undefined> =
  | keyof JSX.IntrinsicElements
  | (ComponentType<P> & { style?: Style<P, T> })

function getParamsByComponent<P = any, T = undefined>(
  component: StyleComponent<P, T>, defaultName: string = "component",
): { tag: string; element?: undefined; name: string; style?: undefined }
  | { tag?: undefined; element: ComponentType<P>; name: string; style?: Style<P, T> } {
  return typeof component === "string" ? {
    name: component,
    tag: component,
  } : {
    name: getComponentName(component, defaultName),
    element: component,
    style: component.style,
  };
}

let counter = 0;

function defaultGenerateId(name: string, options: { dynamic?: boolean } = {}): string {
  let id: string = name;
  if (options.dynamic) {
    id += `_d${(++counter).toString(16)}`;
  }
  return id;
}

export interface StyledOptions {
  name?: string;
  classNamePrefix?: string;
  generateId?: typeof defaultGenerateId;
  shouldForwardProp?: (props: string) => boolean;
}

function createStyled(jss: Jss) {
  return function Styled<P extends StyledProps, T = undefined>(component: StyleComponent<P>, options: StyledOptions = {}) {
    const componentParams = getParamsByComponent(component);
    const element = componentParams.element;
    const tag = componentParams.tag;
    const style = componentParams.style;
    const name = options?.name ?? componentParams.name;
    const generateId = options?.generateId ?? defaultGenerateId;
    const shouldForwardProp = options?.shouldForwardProp ?? ((prop) => prop != "theme");

    const availableStyleNames: string[] = [];
    const propsFilter = (props: object) => Object.keys(props).filter(
      (prop) => tag != null ? isValidProp(prop) || shouldForwardProp(prop) : shouldForwardProp(prop),
    ).reduce<object>((filterProps, key) => (
      props[key] !== undefined ? {...filterProps, [key]: props[key]} : filterProps
    ), {});
    return function styles(...componentStyles: Style<P, T>[]) {
      const styles = [style, ...componentStyles].filter(Boolean) as JssStyle<P, T>[];
      const {staticStyle, dynamicStyle} = getSeparatedStyles<P, T>(styles);
      const styleSheet: StyleSheet = jss.createStyleSheet({}, {
        link: true, meta: `styled(${name})`, classNamePrefix: options.classNamePrefix,
      });

      let staticStyleName: string | undefined;
      if (staticStyle != null) {
        staticStyleName = generateId(name, {dynamic: false});
        styleSheet.addRule(staticStyleName, staticStyle);
      }

      class StyledComponent extends Component<P & { forwardRef?: any, theme?: T }> {
        static displayName?: string;

        readonly staticStyleName?: string;
        readonly dynamicStyleName?: string;

        constructor(props: P) {
          super(props);
          this.staticStyleName = staticStyleName;
          if (dynamicStyle != null) {
            this.dynamicStyleName = availableStyleNames.pop() || generateId(name, {dynamic: true});
            styleSheet.addRule(this.dynamicStyleName, dynamicStyle as unknown as JssStyle);
            styleSheet.update(this.dynamicStyleName, props);
          }
          if (!styleSheet.attached) {
            styleSheet.attach();
          }
        }

        shouldComponentUpdate(nextProps: P, nextState: any, nextContext: any): boolean {
          if (this.dynamicStyleName) {
            styleSheet.update(this.dynamicStyleName, nextProps);
          }
          return Object.entries({
            children: this.props.children, className: this.props.className, ...propsFilter(this.props),
          }).some(([key, value]) => (
            value !== nextProps[key]
          ));
        }

        componentWillUnmount() {
          if (this.dynamicStyleName) {
            styleSheet.deleteRule(this.dynamicStyleName);
            availableStyleNames.push(this.dynamicStyleName);
          }
        }

        render() {
          const {forwardRef, className, children, ...otherProps} = this.props;
          const styledClassName = classnames(
            this.staticStyleName && styleSheet.classes[this.staticStyleName],
            this.dynamicStyleName && styleSheet.classes[this.dynamicStyleName],
            className,
          );
          return createElement((element || tag)!, {
            ref: forwardRef, className: styledClassName, ...propsFilter(otherProps),
          } as unknown as P, children);
        }
      }

      const ForwardRefComponent = forwardRef<any, Omit<P, "ref" | "theme">>((props, ref) => {
        const theme = useTheme();
        return createElement(StyledComponent, {forwardRef: ref, theme: theme, ...props} as unknown as any);
      });

      if (typeof component != "string") {
        hoistNonReactStatics(ForwardRefComponent, component);
      }
      if (process.env.NODE_ENV !== "production") {
        if (element != null) {
          element.displayName = `Inner(${name}))`;
        }
        StyledComponent.displayName = `Styled(${name})`;
        ForwardRefComponent.displayName = `ForwardRef(${name})`;
      }
      return ForwardRefComponent as unknown as ComponentType<P>;
    };
  };
}

export default createStyled;
