import React from "react";

type ProviderProps<T> =
  & ({ value: T; expand?: undefined } | { value?: undefined; expand: (outerValue: T) => T })
  & { children?: React.ReactNode | React.ReactNode[] }

function createProviderByContext<T>(context: React.Context<T>, name: string) {
  const Provider: React.FunctionComponent<ProviderProps<T>> = (props) => {
    const {value, expand, children} = props;

    const lastRef = React.useRef<ProviderProps<T>["value"] | ProviderProps<T>["expand"]>();
    const cachedValueRef = React.useRef<T>();
    const lastOuterValueRef = React.useRef<T>();

    const getValue = React.useCallback((outerValue: T): T => {
      const last = value ?? expand;
      if (last != lastRef.current || outerValue != lastOuterValueRef.current || cachedValueRef.current == null) {
        lastRef.current = last;
        lastOuterValueRef.current = outerValue;
        if (expand != null) {
          cachedValueRef.current = expand(outerValue);
        } else {
          cachedValueRef.current = value;
        }
      }
      return cachedValueRef.current;
    }, [value, expand, lastRef, lastOuterValueRef, cachedValueRef]);

    const renderProvider = React.useCallback((outerValue: T) => {
      return React.createElement(context.Provider, {value: getValue(outerValue)}, children);
    }, [getValue, children]);

    return React.createElement(context.Consumer, {children: renderProvider});
  };
  if (process.env.NODE_ENV !== "production") {
    Provider.displayName = `provider(${name})`;
  }
  return Provider;
}

export default createProviderByContext;
