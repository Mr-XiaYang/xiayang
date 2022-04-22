import React from "react";

function getComponentName(component: keyof JSX.IntrinsicElements | React.ComponentType<any>, defaultName: string = "unknown"): string {
  return typeof component == "string" ? component : component.displayName || component.name || defaultName;
}

export default getComponentName;
