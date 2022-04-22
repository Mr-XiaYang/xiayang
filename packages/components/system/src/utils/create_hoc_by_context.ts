import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import getComponentName from "./get_component_name";

export default function createHocByContext<T, K extends Lowercase<string>>(context: React.Context<T>, name: string, propsKey: K) {
  return function hoc<InnerProps extends object & { [k in K]?: T },
    OuterProps extends Omit<InnerProps, K> = Omit<InnerProps, K>,
    InnerComponent extends React.ComponentType<InnerProps> = React.ComponentType<InnerProps>>(component: InnerComponent) {
    const withHoc = React.forwardRef<any, OuterProps>((props, ref) => {
      return React.createElement(context.Consumer, {
        children: value => {
          if (value == null) {
            throw new Error(`Please use \`${name}\` hoc only with the provider.`);
          }
          return React.createElement(component, {ref, [propsKey]: value, ...props} as unknown as InnerProps);
        },
      });
    }) as unknown as React.ComponentType<OuterProps>;

    if (process.env.NODE_ENV !== "production") {
      withHoc.displayName = `withHoc(${getComponentName(component)}):${name}`;
    }

    hoistNonReactStatics(withHoc, component);
    return withHoc;
  };
}
