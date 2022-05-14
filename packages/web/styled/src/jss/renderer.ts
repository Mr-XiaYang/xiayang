import JssSheet from "./jss_sheet";

export class Renderer {
  constructor(sheet: JssSheet) {
  }
}

export type RendererConstructor = (new (sheet: JssSheet<any>) => Renderer)

