import { JssStyle } from "jss";

export type Style<Props = any, Theme = undefined> =
  | JssStyle<Props, Theme> | undefined | null
  | ((props: Props & { theme: Theme }) => JssStyle<Props, Theme> | undefined | null)
