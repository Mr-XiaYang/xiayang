import { create, Jss, JssOptions } from "jss";
import React from "react";
import global from "jss-plugin-global";
import nested from "jss-plugin-nested";
import camelCase from "jss-plugin-camel-case";
import expand from "jss-plugin-expand";
import propsSort from "jss-plugin-props-sort";
import defaultUnit from "jss-plugin-default-unit";
import vendorPrefixer from "jss-plugin-vendor-prefixer";
import ruleValueFunction from "jss-plugin-rule-value-function";
import ruleValueObservable from "jss-plugin-rule-value-observable";
import {createProviderByContext, createHookByContext, createHOCByContext} from "@xiayang/utils"

export const createJss = (options?: Pick<JssOptions, "id" | "createGenerateId" | "insertionPoint">): Jss => create({
  ...options,
  plugins: [
    global(),
    nested(),
    camelCase(),
    defaultUnit(),
    expand(),
    propsSort(),
    vendorPrefixer(),
    ruleValueFunction(),
    ruleValueObservable()],
});

export const jss = createJss();
export const JssContext = React.createContext<Jss>(jss);
export const JssProvider = createProviderByContext(JssContext, "jss");
export const withJss = createHOCByContext(JssContext, "jss", "jss");
export const useJss = createHookByContext(JssContext, "jss");

if (process.env.NODE_ENV !== "production") {
  JssContext.displayName = "JssContext";
}

