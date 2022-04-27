import type { JssStyle, MinimalObservable } from "jss";
import isObservable from "../utils/is_observable";
import { Style } from "./type";

type StaticStyle<T extends JssStyle<Props, Theme>, Props = any, Theme = undefined> = {
  [K in keyof T]?: Exclude<T[K], MinimalObservable<any> | ((...args: any[]) => any)>
}

type DynamicStyle<T extends JssStyle<Props, Theme>, Props = any, Theme = undefined> = {
  [K in keyof T]?: Extract<T[K], MinimalObservable<any> | ((...args: any[]) => any)>
}

function separatedStyles<Props = any, Theme = undefined, Style extends JssStyle = JssStyle<Props, Theme>>(style: Style): {
  staticStyle?: StaticStyle<Style>, dynamicStyle?: DynamicStyle<Style>
} {
  const staticStyle: StaticStyle<Style> = {};
  const dynamicStyle: DynamicStyle<Style> = {};
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === "function" || isObservable(value)) {
      dynamicStyle[key] = value;
    } else if (value != null && typeof value === "object" && !Array.isArray(value)) {
      const innerStyle = separatedStyles(value);
      if (innerStyle.staticStyle != null) staticStyle[key] = innerStyle.staticStyle;
      if (innerStyle.dynamicStyle != null) dynamicStyle[key] = innerStyle.dynamicStyle;
    } else {
      staticStyle[key] = value;
    }
  }
  return {
    staticStyle: Object.keys(staticStyle).length > 0 ? staticStyle : undefined,
    dynamicStyle: Object.keys(dynamicStyle).length > 0 ? dynamicStyle : undefined,
  };
}

function getSeparatedStyles<Props = any, Theme = undefined>(
  initialStyles: Style<Props, Theme>[],
): {
  staticStyle?: StaticStyle<JssStyle<Props, Theme>>,
  dynamicStyle?: DynamicStyle<JssStyle<Props, Theme>>
  functionStyle?: ((props: Props & { theme: Theme }) => JssStyle<Props, Theme>)
} {
  const styles: Exclude<Style<Props, Theme>, ((...args: any[]) => any) | null | undefined> = {};
  const functionStyleList: Extract<Style<Props, Theme>, ((...args: any[]) => any)>[] = [];

  for (const style of initialStyles) {
    if (style != null) {
      if (typeof style === "object" && style.toString === Object.prototype.toString) {
        Object.assign(styles, style);
      } else if (typeof style === "function") {
        functionStyleList.push(style);
      }
    }
  }
  const {staticStyle, dynamicStyle} = separatedStyles(styles);
  let functionStyle = functionStyleList.length > 0 ? (
    (props: Props & { theme: Theme }): JssStyle<Props, Theme> => {
      const fnResults = [];
      for (const functionStyle of functionStyleList) {
        fnResults.push(functionStyle(props));
      }
      return Object.assign({}, ...fnResults);
    }) : undefined;
  return {staticStyle, dynamicStyle, functionStyle};
}


export default getSeparatedStyles;
