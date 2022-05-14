import { Style } from "./interfaces/style";
import PluginsRegistry from "./plugins_registry";
import JssSheet, { JssSheetOptions } from "./jss_sheet";
import internalPlugins from "./plugins";
import { Renderer, RendererConstructor } from "./renderer";
import { defaultGenerateId, GenerateId, GenerateIdOptions } from "./utils/generate_id";
import { isBrowser } from "@xiayang/utils";
import { PluginInterface } from "./interfaces/plugin";

interface JssOptions {
  minifyId?: boolean,
  generateId?: GenerateId,
  generateIdOptions?: GenerateIdOptions
  renderer?: RendererConstructor,
  plugins: PluginInterface[]
}

class Jss {
  readonly renderer: RendererConstructor | null;
  readonly generateId: GenerateId;
  readonly generateIdOptions: GenerateIdOptions;

  readonly sheets: JssSheet[] = [];
  readonly pluginRegistry: PluginsRegistry = new PluginsRegistry();

  constructor(options?: JssOptions) {
    this.renderer = isBrowser ? options?.renderer ?? Renderer : null;
    this.generateId = options?.generateId ?? defaultGenerateId;
    this.generateIdOptions = options?.generateIdOptions ?? {minify: false};
    for (const plugin of internalPlugins) {
      this.pluginRegistry.use(plugin, {queue: "internal"});
    }
    for (const plugin of options?.plugins ?? []) {
      this.pluginRegistry.use(plugin, {queue: "external"});
    }
  }

  createStyleSheet(style: Style, options?: Partial<JssSheetOptions>) {
    const index: number = typeof options?.index !== "number" ? this.sheets.length + 1 : options.index;
    const sheet = new JssSheet(this, style, {
      index,
      renderer: options?.renderer ?? this.renderer,
      generateId: options?.generateId ?? this.generateId,
      generateIdOptions: options?.generateIdOptions ?? this.generateIdOptions,
    });
    this.pluginRegistry.onProcessSheet(sheet);
    return sheet;
  }
}

export default Jss;
