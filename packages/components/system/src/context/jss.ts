import { create, Jss, JssOptions } from "jss";
import React from "react";
import global from "jss-plugin-global";
import nested from "jss-plugin-nested";
import camelCase from "jss-plugin-camel-case";
import expand from "jss-plugin-expand";
import propsSort from "jss-plugin-props-sort";
import defaultUnit from "jss-plugin-default-unit";
import vendorPrefixer from "jss-plugin-vendor-prefixer";
import createHocByContext from "../utils/create_hoc_by_context";
import createHookByContext from "../utils/create_hook_by_context";
import createProviderByContext from "../utils/create_provider_by_context";

export function createJss(options?: Pick<JssOptions, "id" | "createGenerateId" | "insertionPoint">): Jss {
  return create({
    ...options,
    plugins: [global(), nested(), camelCase(), defaultUnit(), expand(), propsSort(), vendorPrefixer()],
  });
}

export const JssContext = React.createContext<Jss>(createJss());
if (process.env.NODE_ENV !== "production") {
  JssContext.displayName = "JssContext";
}

export const JssProvider = createProviderByContext(JssContext, "jss");
export const withJss = createHocByContext(JssContext, "jss", "jss");
export const useJss = createHookByContext(JssContext, "jss");

