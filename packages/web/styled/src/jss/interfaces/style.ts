import { Properties as CSSProperties } from "csstype";

export type JssValue =
  | null | false | string | number
  | Array<string | number> | [Array<string | number>, "!important"]

export type NormalCssProperties = CSSProperties<string | number>
export type NormalCssValues<K> = K extends keyof NormalCssProperties ? NormalCssProperties[K] : JssValue


export type NormalStyleRule<Data> = {
  [K in keyof NormalCssProperties]: NormalCssValues<K> | ((data?: Data) => NormalCssValues<K>)
}

export type StyleRule<Data> = null | undefined | NormalStyleRule<Data> | {
  [ChildRule in string]: StyleRule<Data>
}

export type Style<Data = any> = { [name: string]: StyleRule<Data> }

