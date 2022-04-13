import { DeepPartial } from "../../../../typings/deep_partial";

export interface Theme {

}

type PartialTheme = DeepPartial<Theme>;

export function createTheme(theme?: PartialTheme): Theme {
  return {};
}

export default createTheme();
