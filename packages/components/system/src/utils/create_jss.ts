import { create, Jss, JssOptions } from "jss";
import global from "jss-plugin-global";
import nested from "jss-plugin-nested";
import camelCase from "jss-plugin-camel-case";
import expand from "jss-plugin-expand";
import propsSort from "jss-plugin-props-sort";
import defaultUnit from "jss-plugin-default-unit";
import vendorPrefixer from "jss-plugin-vendor-prefixer";

function createJss(options?: Pick<JssOptions, "id" | "createGenerateId" | "insertionPoint">): Jss {
  return create({
    ...options,
    plugins: [global(), nested(), camelCase(), defaultUnit(), expand(), propsSort(), vendorPrefixer()],
  });
}

export default createJss;
