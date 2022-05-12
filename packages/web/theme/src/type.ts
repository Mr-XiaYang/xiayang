import * as CSS from "csstype";

interface NestedScaleDict<T> extends ScaleDict<T>, ObjectWithDefault<T> {
}

interface ObjectWithDefault<T> {
  __default?: T;
}

interface ScaleDict<T> {
  [K: string]: T | T[] | NestedScaleDict<T> | undefined;

  [I: number]: T;
}

type Scale<T> = T[] | ScaleDict<T>

type TLengthStyledSystem = string | 0 | number

// https://system-ui.com/theme
export interface Theme {
  breakpoints?: Array<string>;
  mediaQueries?: { [size: string]: string };
  space?: Scale<CSS.Property.Margin<number | string>>;
  letterSpacings?: Scale<CSS.Property.LetterSpacing<TLengthStyledSystem>>;

  sizes?: Scale<CSS.Property.Height<{}> | CSS.Property.Width<{}>>;

  colors?: Scale<CSS.Property.Color>;

  fonts?: Scale<CSS.Property.FontFamily>;
  fontSizes?: Scale<CSS.Property.FontSize<number>>;
  fontWeights?: Scale<CSS.Property.FontWeight>;
  lineHeights?: Scale<CSS.Property.LineHeight<TLengthStyledSystem>>;

  borders?: Scale<CSS.Property.Border<{}>>;
  borderStyles?: Scale<CSS.Property.Border<{}>>;
  borderWidths?: Scale<CSS.Property.BorderWidth<TLengthStyledSystem>>;
  radii?: Scale<CSS.Property.BorderRadius<TLengthStyledSystem>>;
  shadows?: Scale<CSS.Property.BoxShadow>;

  zIndices?: Scale<CSS.Property.ZIndex>;
}
