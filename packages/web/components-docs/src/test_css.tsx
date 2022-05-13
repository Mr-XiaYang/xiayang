import hyphenate from "hyphenate-style-name";
import { Properties as CSSProperties } from "csstype";
import React, { FunctionComponent, useInsertionEffect } from "react";

type JssValue =
  | null | false | string | number
  | Array<string | number> | [Array<string | number>, "!important"]
type NormalCssProperties = CSSProperties<string | number>
type NormalCssValues<K> = K extends keyof NormalCssProperties ? NormalCssProperties[K] : JssValue
type NormalStyleRule<Data> = null | undefined | {
  [K in keyof NormalCssProperties]: NormalCssValues<K> | ((data: Data) => NormalCssValues<K>)
}
type NormalStyle<Data = any> = NormalStyleRule<Data> | { [K in string]: NormalStyle<Data> }

function splitStyle<Data>(style: NormalStyle<Data>, referRuleName: string ):{[K : string]: NormalStyleRule<Data>} | null {
  let rules:{[K : string]: NormalStyleRule<Data>} | null = null
  if(style != null) {
    let rule:NormalStyleRule<Data> = null
    for (const [key, value] of Object.entries(style)) {
      if(typeof value === 'object' && value?.toString === Object.prototype.toString) {
        rules = {...rules??{}, ...splitStyle(value, key.replaceAll("&", referRuleName))}
      } else {
        rule = {...rule??{}, [key]: value}
      }
    }
    if(rule != null) {
      rules={[referRuleName]: rule, ...rules??{}}
    }
  }
  return rules;
}

function useCssVar<Data>(style: NormalStyle<Data>, options: { keyPrefix?:string } = {}): {
  cssVarStyle: NormalStyle<Data>, cssVarConfig: Record<string,  (data:Data)=> JssValue>
} {
  const keyPrefix = options?.keyPrefix ?? 'dynamic'
  let cssVarCounter: number = 0
  let cssVarStyle: NormalStyle<Data> = null;
  let cssVarConfig: Record<string,  (data:Data)=> JssValue> = {}
  if (style != null) {
    for(const key in style) {
      if(typeof style[key] === 'object' && style[key].toString === Object.prototype.toString) {
        const {cssVarStyle: insideStyle, cssVarConfig: insideVarConfig} = useCssVar(
          style[key],{...options, keyPrefix: `${keyPrefix}_${++cssVarCounter}`
        })
        cssVarStyle = {...cssVarStyle??{}, [key]: insideStyle}
        cssVarConfig = {...cssVarConfig, ...insideVarConfig}
      } else if (typeof style[key] === "function") {
        const name = `--${keyPrefix}_${++cssVarCounter}`;
        cssVarStyle = {...cssVarStyle??{}, [key]: `var(${name})`}
        cssVarConfig = {...cssVarConfig, [name] : style[key]}
      } else {
        cssVarStyle = {...cssVarStyle??{}, [key]: style[key]}
      }
    }
  }
  return {cssVarStyle, cssVarConfig};
}


function createStyleHook<Data extends object>(name:string, style: NormalStyle<Data>, options?: {
  defaultData?: Data
}) {
  const {cssVarStyle, cssVarConfig} = useCssVar(style, {keyPrefix:name});
  const rules = splitStyle(cssVarStyle, `.${name}`);
  console.log(rules, cssVarConfig)
  return function useStyle<Theme>(data: Data) {


    // useInsertionEffect(() => {
    //   const element = document.createElement("style");
    //   // element.textContent = style;
    //   // document.head.appendChild(element);
    //   return () => {
    //     document.head.removeChild(element);
    //   };
    // }, []);
    return [];
  };
}

const useStyle = createStyleHook<{ color?: string }>("Box",{
  color: (data) => data.color,
  "&:hover": {
    background: "blue",
  },
  "&.clear": {
    clear: "both",
  },
  // Reference a global .button scoped to the container.
  "& .button": {
    background: "red",
  },
  // Use multiple container refs in one selector
  "&.selected, &.active": {
    border: "1px solid red",
  },

});


export const Test: FunctionComponent<{ color?: string }> = (props) => {
  const [classes, style] = useStyle(props);
  return (
    <div className={"Test-01"}>
      test
    </div>);
};
