import { Properties as CSSProperties } from "csstype";
import { JssStyle, JssValue } from "jss";

export type { JssStyle } from "jss";
export type FuncStyle<P, T> = (props: P & { theme: T }) => JssStyle<P, T> | undefined | null

export type Style<Props = any, Theme = undefined> =
  | JssStyle<Props, Theme> | FuncStyle<Props, Theme>
