import { JssValue, StyleInterface } from "./interfaces/style";

function addDefaultUnit<T>(style: StyleInterface<T>):void {

}

type CssVarGetter<T> = { name: string, getter: (data?: T)=> JssValue }
function enableCssVar<T>(style: StyleInterface<T>, cssVarGetters: CssVarGetter<T>[], cssVarPrefix: string = 'dynamic'):void {
  let cssVarCounter: number = 0
  if (style !=null) {
    for (const key in style) {
      if(typeof style[key] === 'object' && style[key].toString === Object.prototype.toString) {
        enableCssVar(style[key], cssVarGetters, `${cssVarPrefix}-${++cssVarCounter}`)
      } else if (typeof style[key] === "function") {
        const name = `--${cssVarPrefix}-${key}`
        cssVarGetters.push({name, getter: style[key]})
        style[key] = `var(${name})`;
      }
    }
  }
}

export default function createStyleHook<T>(name: string, style: StyleInterface<T>) {
  const baseSelectorText = `.${name}`;
  const cssVarGetters: CssVarGetter<T>[] = [];

  addDefaultUnit(style);
  enableCssVar(style, cssVarGetters, name)
  console.log(style)
}
