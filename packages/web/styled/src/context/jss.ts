import { createHOCByContext, createHookByContext, createProviderByContext } from "@xiayang/utils";
import { create, Jss, JssOptions } from "jss";

import cache from "jss-plugin-cache";
import camelCase from "jss-plugin-camel-case";
import defaultUnit from "jss-plugin-default-unit";
import expand from "jss-plugin-expand";
import extend from "jss-plugin-extend";
import global from "jss-plugin-global";
import isolate from "jss-plugin-isolate";
import nested from "jss-plugin-nested";
import propsSort from "jss-plugin-props-sort";
import ruleValueFunction from "jss-plugin-rule-value-function";
import ruleValueObservable from "jss-plugin-rule-value-observable";
import template from "jss-plugin-template";
import vendorPreFixer from "jss-plugin-vendor-prefixer";
import React from "react";


export const createJss = (options?: Pick<JssOptions, "id" | "createGenerateId" | "insertionPoint">): Jss => create({
  ...options,
  plugins: [
    ruleValueFunction(), ruleValueObservable(), template(),
    cache(), global(), extend(), nested(), camelCase(), defaultUnit(),
    expand(), propsSort(), vendorPreFixer()
  ],
});

export const jss = createJss();
export const JssContext = React.createContext<Jss>(jss);
export const JssProvider = createProviderByContext(JssContext, "jss");
export const withJss = createHOCByContext(JssContext, "jss", "jss");
export const useJss = createHookByContext(JssContext, "jss");

if (process.env.NODE_ENV !== "production") {
  JssContext.displayName = "JssContext";
}

