import { PluginInterface } from "./interfaces/plugin";
import JssSheet from "./jss_sheet";


class PluginsRegistry implements NonNullable<PluginInterface> {
  protected plugins: Record<"internal" | "external", Array<PluginInterface>> = {
    internal: [], external: [],
  };

  protected registry: { [K in keyof PluginInterface]-?: Array<NonNullable<PluginInterface[K]>> } = {
    onCreateRule: [], onProcessRule: [], onProcessStyle: [], onProcessSheet: [], onChangeValue: [], onUpdate: [],
  };

  public use(plugin: PluginInterface, options?: { queue?: "internal" | "external" }) {
    const plugins = this.plugins[options?.queue ?? "external"];
    if (plugins.indexOf(plugin) > 0) {
      return;
    }
    plugins.push(plugin);

    this.registry = new Array<PluginInterface>().concat(
      ...this.plugins.external, ...this.plugins.internal,
    ).reduce<{ [K in keyof PluginInterface]-?: Array<NonNullable<PluginInterface[K]>> }>(
      (registry, plugin) => {
        for (const hook in registry) {
          if (plugin[hook] != null) {
            registry[hook].push(plugin[hook]);
          }
        }
        return registry;
      }, {
        onCreateRule: [], onProcessSheet: [], onProcessStyle: [], onProcessRule: [], onChangeValue: [], onUpdate: [],
      },
    );
  }

  public onCreateRule(name: string, ...args: any[]): any {
    for (const onCreateRule of this.registry.onCreateRule) {
      const rule = onCreateRule(name, ...args);
      if (rule != null) {
        return rule;
      }
    }

    return null;
  }

  public onProcessSheet(sheet: JssSheet): any {
    for (const onProcessSheet of this.registry.onProcessSheet) {
      onProcessSheet(sheet);
    }
  }

  public onProcessStyle(): any {
  }

  public onProcessRule(): any {

  }

  public onChangeValue(): any {
  }

  public onUpdate(): any {
  }
}

export default PluginsRegistry;
