import { JssValue, Style, StyleRule, NormalCssValues, NormalStyleRule } from "./jss/interfaces/style";

// function addDefaultUnit<T>(style: StylesInterface<T>): void {
//
// }
//
// type CssVarGetter<T> = { name: string, getter: (data?: T) => JssValue }
//
// function enableCssVar<T>(style: StyleInterface<T>, cssVarGetters: CssVarGetter<T>[], cssVarPrefix: string = "dynamic"): void {
//   let cssVarCounter: number = 0;
//   if (style != null) {
//     for (const key in style) {
//       if (typeof style[key] === "object" && style[key].toString === Object.prototype.toString) {
//         enableCssVar(style[key], cssVarGetters, `${cssVarPrefix}-${++cssVarCounter}`);
//       } else if (typeof style[key] === "function") {
//         const name = `--${cssVarPrefix}-${key}`;
//         cssVarGetters.push({name, getter: style[key]});
//         style[key] = `var(${name})`;
//       }
//     }
//   }
// }

export class SheetStyleRule<T> {
  readonly selectorText: string;
  readonly rule: StyleRule<T>;
  readonly parent: SheetStyle<T> | SheetStyleRule<T>;

  constructor(parent: SheetStyle<T> | SheetStyleRule<T>, selectorText: string, styleRule: StyleRule<T>) {
    this.parent = parent;
    this.selectorText = selectorText;
    this.rule = styleRule;
  }
}

export interface SheetStyleOptions {
}

export class SheetStyle<T> {
  readonly options: SheetStyleOptions;
  readonly styleRules: { [selectorText: string]: SheetStyleRule<T> } = {};
  readonly style: { [selectorText: string]: JssValue | ((data: T) => JssValue) } = {};

  constructor(styles: Style<T>, options: SheetStyleOptions = {}) {
    this.options = options;
    this.addStyles(styles);
  }

  addStyles(styles: Style<T>) {
    for (const [selectorText, styleRule] of Object.entries(styles)) {
      if (styleRule != null) {
        this.addRule(selectorText, styleRule);
      }
    }
    return this;
  }

  addRule(selectorText: string, styleRule: NonNullable<StyleRule<T>>) {
    const rule: StyleRule<T> = {};
    const childRules: Record<string, NonNullable<StyleRule<T>>> = {};
    for (const prop in styleRule) {
      if (typeof styleRule[prop] === "object" && styleRule[prop]!.toString === Object.prototype.toString) {
        childRules[prop] = styleRule[prop]!;
      } else {
        rule[prop] = styleRule[prop];
      }
    }
    this.styleRules[selectorText] = new SheetStyleRule<T>(this, selectorText, rule);
    for (const [childSelectorText, childStyleRule] of Object.entries(childRules)) {
      const formatSelectorText = childSelectorText.replace(/&/g, selectorText);
      this.styleRules[formatSelectorText] = new SheetStyleRule<T>(this.styleRules[selectorText], formatSelectorText, childStyleRule);
    }
    return this.styleRules[selectorText];
  }
}


export default function createStyleHook<T>(styles: Style<T>, options: SheetStyleOptions = {}) {
  const style = new SheetStyle<T>(styles, options);
  console.log(style);
}
