import { Properties as CSSProperties } from "csstype";
import { JssStyle, JssValue } from "jss";

type NormalCssProperties = CSSProperties<string | number>
type NormalCssValues<K> = K extends keyof NormalCssProperties ? NormalCssProperties[K] : JssValue

export type NormalStyle =
  | null
  | undefined
  | { [K in string]: JssValue }
  | { [K in keyof NormalCssProperties]: NormalCssValues<K> }
export type { JssStyle } from "jss";
export type FuncStyle<P, T> = (props: P & { theme: T }) => NormalStyle

export type Style<Props = any, Theme = undefined> =
  | NormalStyle | JssStyle<Props, Theme> | FuncStyle<Props, Theme>
