import { useTheme } from "@xiayang/theme";
import { classnames, getComponentName, hoistNonReactStatics } from "@xiayang/utils";
import { Jss, JssStyle, SheetsManager, StyleSheet } from "jss";
import { Component, ComponentType, createElement, forwardRef, ReactNode, Ref } from "react";
import getSeparatedStyles from "./utils/get_separated_styles";
import { Style } from "./type";
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

    let instanceCounter: number = 0;
    const availableStyleNames: string[] = [];
    const sheetsManager: SheetsManager = new SheetsManager();
    const propsFilter = (props: object) => Object.keys(props).filter(
      (prop) => tag != null ? isValidProp(prop) || shouldForwardProp(prop) : shouldForwardProp(prop),
    ).reduce<object>((filterProps, key) => (
      props[key] !== undefined ? {...filterProps, [key]: props[key]} : filterProps
    ), {});
    return function styles(...componentStyles: Style<P, T>[]) {
      const styles = [style, ...componentStyles].filter(Boolean) as JssStyle<P, T>[];
      const {staticStyle, dynamicStyle, functionStyle} = getSeparatedStyles<P, T>(styles);
      let styleSheet: StyleSheet | undefined;
      let staticStyleName: string | undefined;
      if (staticStyle != null) {
        staticStyleName = generateId(name, {dynamic: false});
        styleSheet = jss.createStyleSheet({[staticStyleName]: staticStyle}, {
          link: true, meta: `styled(${name})`, classNamePrefix: options.classNamePrefix,
        });
        styleSheet.addRule(staticStyleName, staticStyle);
        sheetsManager.add(componentParams, styleSheet);
      }

      class StyledComponent extends Component<P & { forwardRef?: any, theme?: T }> {
        static displayName?: string;

        readonly styleSheet?: StyleSheet;
        readonly staticStyleName?: string;
        readonly dynamicStyleName?: string;
        readonly functionStyleName?: string;

        constructor(props: P) {
          super(props);
          this.staticStyleName = staticStyleName;
          if (!!dynamicStyle || !!functionStyle) {
            this.styleSheet = jss.createStyleSheet({}, {
              link: true,
              meta: `styled(${name}):instance${++instanceCounter}`,
              classNamePrefix: options.classNamePrefix,
            });
            this.dynamicStyleName = dynamicStyle ? availableStyleNames.pop() || generateId(name, {dynamic: true}) : undefined;
            if (this.dynamicStyleName != null) {
              this.styleSheet.addRule(this.dynamicStyleName, dynamicStyle!);
            }
            this.functionStyleName = functionStyle ? availableStyleNames.pop() || generateId(name, {dynamic: true}) : undefined;
            if (this.functionStyleName != null) {
              this.styleSheet.addRule(this.functionStyleName, functionStyle! as unknown as any);
            }
            this.styleSheet.update(this.props);
            sheetsManager.add(this, this.styleSheet);
          }
          sheetsManager.manage(componentParams);
          sheetsManager.manage(this);
        }

        shouldComponentUpdate(nextProps: P, nextState: any, nextContext: any): boolean {
          this.styleSheet?.update(nextProps);
          return Object.entries({
            children: this.props.children, className: this.props.className, ...propsFilter(this.props),
          }).some(([key, value]) => (
            value !== nextProps[key]
          ));
        }

        componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<{}>, snapshot?: any) {
          if (this.props != prevProps) {
            this.styleSheet?.update(this.props);
          }
        }

        componentWillUnmount() {
          sheetsManager.unmanage(this);
          sheetsManager.unmanage(componentParams);
          if (this.dynamicStyleName) {
            availableStyleNames.push(this.dynamicStyleName);
          }
          if (this.functionStyleName) {
            availableStyleNames.push(this.functionStyleName);
          }
        }

        render() {
          const {forwardRef, className, children, ...otherProps} = this.props;
          const styledClassName = classnames(
            this.staticStyleName && styleSheet!.classes[this.staticStyleName],
            this.dynamicStyleName && this.styleSheet!.classes[this.dynamicStyleName],
            this.functionStyleName && this.styleSheet!.classes[this.functionStyleName],
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
