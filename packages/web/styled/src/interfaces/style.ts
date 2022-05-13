import { Properties as CSSProperties } from "csstype";

export type JssValue =
  | null | false | string | number
  | Array<string | number> | [Array<string | number>, "!important"]

export type NormalCssProperties = CSSProperties<string | number>
export type NormalCssValues<K> = K extends keyof NormalCssProperties ? NormalCssProperties[K] : JssValue

export type StyleRuleInterface<Data> = null | undefined | {
  [K in keyof NormalCssProperties]: NormalCssValues<K> | ((data?: Data) => NormalCssValues<K>)
}

export type StyleInterface <Data = any> = StyleRuleInterface<Data> | { [K in string]: StyleInterface<Data> }

