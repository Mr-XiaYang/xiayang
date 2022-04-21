export interface FontSizes {
  "xs": string | number;
  "sm": string | number;
  "md": string | number;
  "lg": string | number;
  "xl": string | number;

  [key: number]: string | number;
}

export interface Space {
  [key: number]: string | number;
}

export interface Colors {
  white: string,
  black: string,
  grey: string,
  greys: [string, string, string],
  red: string,
  reds: [string, string, string],
  green: string,
  greens: [string, string, string],
  blue: string,
  blues: [string, string, string],
  pink: string,
  pinks: [string, string, string],
  purple: string,
  purples: [string, string, string],
  teal: string,
  teals: [string, string, string],
  yellow: string,
  yellows: [string, string, string],
  orange: string,
  oranges: [string, string, string],
  brown: string,
  browns: [string, string, string],
}

export interface Breakpoints {
  "xs": string | number;
  "sm": string | number;
  "md": string | number;
  "lg": string | number;
  "xl": string | number;
}

interface Theme {
  space: Space
  fontSizes: FontSizes
  colors: Colors
  breakpoints: Breakpoints,
}

export default Theme;
