import type JssSheet from "../jss_sheet";

export interface PluginInterface {
  onCreateRule?: ((name: string, ...args: any[]) => any),
  onProcessSheet?: ((sheet: JssSheet) => void),
  onProcessStyle?: ((...args: any[]) => any),
  onProcessRule?: ((...args: any[]) => any),
  onChangeValue?: ((...args: any[]) => any),
  onUpdate?: ((...args: any[]) => any)
}
