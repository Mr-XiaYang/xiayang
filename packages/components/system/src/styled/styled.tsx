import React, { PropsWithChildren } from "react";
import { useJss } from "../context/jss";
import classnames from "../utils/classnames";
import getComponentName from "../utils/get_component_name";

type StyleType = object
type Component<Props extends object = {}> =
  (React.ComponentType<Props> & { style?: StyleType })
  | keyof JSX.IntrinsicElements

function getParamsByComponent<P extends object>(component: Component<P>): { component: Component<any>; tagName: string; style?: StyleType } {
  if (typeof component === "string") {
    return {tagName: component, component: component};
  } else {
    return {tagName: getComponentName(component, "StyledComponent"), component, style: component.style};
  }
}

function styled<Props extends { className: string, children?: React.ReactNode | React.ReactNode[] }>(component: Component<Props>) {
  const {component: element, tagName, style} = getParamsByComponent(component);
  return function (...componentStyle: StyleType[]): React.FunctionComponent<Props> {
    const styles = new Array<StyleType | undefined>(style).concat(componentStyle).filter(
      (style): style is StyleType => style != null,
    );
    return function (props) {
      const {className, children, ...otherProps} = props;
      const jss = useJss();
      const styledClassName = classnames(className);

      return React.createElement(element, {...otherProps, className: styledClassName}, children);
    };
  };
}

export default styled;
