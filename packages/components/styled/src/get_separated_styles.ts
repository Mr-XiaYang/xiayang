import type { JssStyle, MinimalObservable } from "jss";
import { isObservable } from "@xiayang/utils";
import { Style } from "./type";

type StaticStyle<T extends JssStyle<Props, Theme>, Props = any, Theme = undefined> = {
  [K in keyof T]?: Exclude<T[K], MinimalObservable<any> | ((...args: any[]) => any)>
}

type DynamicStyle<T extends JssStyle<Props, Theme>, Props = any, Theme = undefined> = {
  [K in keyof T]?: Extract<T[K], MinimalObservable<any> | ((...args: any[]) => any)>
}

function separatedStyles<P = any, T = undefined, Style extends JssStyle = JssStyle<P, T>>(style: Style): {
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

function getSeparatedStyles<P = any, T = undefined>(
  initialStyles: Style<P, T>[],
): {
  staticStyle?: StaticStyle<JssStyle<P, T>>,
  dynamicStyle?: DynamicStyle<JssStyle<P, T>>
  functionStyle?: ((props: P & { theme: T }) => JssStyle<P, T>)
} {
  const styles: Exclude<Style<P, T>, ((...args: any[]) => any) | null | undefined> = {};
  const functionStyleList: Extract<Style<P, T>, ((...args: any[]) => any)>[] = [];

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
    (props: P & { theme: T }): JssStyle<P, T> => {
      const fnResults = [];
      for (const functionStyle of functionStyleList) {
        fnResults.push(functionStyle(props));
      }
      return Object.assign({}, ...fnResults);
    }) : undefined;
  return {staticStyle, dynamicStyle, functionStyle};
}


export default getSeparatedStyles;
