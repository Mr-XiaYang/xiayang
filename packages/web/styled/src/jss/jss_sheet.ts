import type Jss from "./jss";
import { JssValue, NormalCssProperties, NormalStyleRule, Style } from "./interfaces/style";
import JssSheetRules from "./jss_sheet_rules";
import { defaultGenerateId, GenerateId, GenerateIdOptions } from "./utils/generate_id";
import { Renderer, RendererConstructor } from "./renderer";

export interface JssSheetOptions {
  index: number,
  generateId: GenerateId,
  generateIdOptions: GenerateIdOptions,
  renderer: RendererConstructor | null,
}

class JssSheet<T extends object = {}> {
  rules: JssSheetRules;
  renderer: Renderer | null;

  keyframes: Record<string, string> = {};

  classes: Record<string, string> = {};
  inlineStyle: NormalStyleRule<T> = {};
  deployed: boolean = false;
  attached: boolean = false;


  constructor(jss: Jss, style: Style, options: JssSheetOptions) {
    this.rules = new JssSheetRules({
      jss: jss, parent: jss, keyframes: this.keyframes,
      classes: this.classes, inlineStyle: this.inlineStyle,
    });
    this.renderer = options.renderer ? new options.renderer(this) : null;

  }
}

export default JssSheet;
