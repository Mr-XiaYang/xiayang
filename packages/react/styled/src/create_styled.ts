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
  return (++counter).toString(16);
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

    const propsFilter = (props: object, options?: { isTag?: boolean }) => Object.keys(props).filter(
      (prop) => options?.isTag ? isValidProp(prop) || shouldForwardProp(prop) : shouldForwardProp(prop),
    ).reduce<object>(
      (filterProps, key) => ({...filterProps, [key]: props[key]}), {},
    );
    return function styles(...componentStyles: Style<P, T>[]) {
      const styles = [style, ...componentStyles].filter(Boolean) as JssStyle<P, T>[];
      const {staticStyle, dynamicStyle, functionStyle} = getSeparatedStyles<P, T>(styles);
      const sheetsManager = new SheetsManager();
      let styleSheet: StyleSheet | undefined;
      let staticStyleName: string | undefined;
      if (staticStyle != null) {
        staticStyleName = generateId(name, {dynamic: false});
        styleSheet = jss.createStyleSheet({[staticStyleName]: staticStyle}, {
          link: true, meta: `styled-${name}`, classNamePrefix: options.classNamePrefix,
        });
        styleSheet.addRule(staticStyleName, staticStyle);
      }

      class StyledComponent extends Component<P & { forwardRef?: any, theme?: T }> {
        static displayName?: string;

        readonly staticStyleName?: string;
        readonly dynamicStyleName?: string;
        readonly functionStyleName?: string;

        constructor(props: P) {
          super(props);
          if (!!styleSheet?.attached) {
            styleSheet!.attach();
          }
          // if (!!staticStyle) {
          //   this.staticStyleName = staticStyleName;
          //   if (!sheet.getRule(this.staticStyleName!)) {
          //     sheet.addRule(this.staticStyleName!, staticStyle);
          //   }
          // }
          // if (!!dynamicStyle) {
          //   this.dynamicStyleName = availableStyleNames.pop() || generateId(name);
          //   if (!sheet.getRule(this.dynamicStyleName!)) {
          //     sheet.addRule(this.dynamicStyleName!, dynamicStyle);
          //   }
          // }
          // if (!!functionStyle) {
          //   this.functionStyleName = availableStyleNames.pop() || generateId(name);
          //   if (!sheet.getRule(this.functionStyleName!)) {
          //     sheet.addRule(this.functionStyleName!, functionStyle as unknown as JssStyle);
          //   }
          // }
          // this.updateSheet(props);
          // !sheet.attached && sheet.attach();
        }

        componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<{}>, snapshot?: any) {
          if (this.props != prevProps) {
            this.updateSheet(this.props);
          }
        }

        componentWillUnmount() {
          // if (this.dynamicStyleName) {
          //   sheet.deleteRule(this.dynamicStyleName);
          //   availableStyleNames.push(this.dynamicStyleName);
          // }
          // if (this.functionStyleName) {
          //   sheet.deleteRule(this.functionStyleName);
          //   availableStyleNames.push(this.functionStyleName);
          // }
        }

        updateSheet(props: P) {
          // this.dynamicStyleName && sheet.update(this.dynamicStyleName, props);
          // this.functionStyleName && sheet.update(this.functionStyleName, props);
        }

        render() {
          const {forwardRef, className, children, ...otherProps} = this.props;
          const styledClassName = classnames(
            // this.staticStyleName && sheet.classes[this.staticStyleName],
            // this.dynamicStyleName && sheet.classes[this.dynamicStyleName],
            // this.functionStyleName && sheet.classes[this.functionStyleName],
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
