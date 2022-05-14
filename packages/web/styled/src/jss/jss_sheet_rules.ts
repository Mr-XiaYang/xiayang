import { NormalStyleRule } from "./interfaces/style";
import Jss from "./jss";

export interface JssSheetRulesOptions {
  jss: Jss | StyleSheet,
  parent: Jss | StyleSheet
  keyframes: Record<string, string>;
  classes: Record<string, string>;
  inlineStyle: NormalStyleRule<any>;
}

class JssSheetRules {
  constructor(options: JssSheetRulesOptions) {
  }
}

export default JssSheetRules;
