import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import {getBabelOutputPlugin} from "@rollup/plugin-babel";
import nodeResolve from '@rollup/plugin-node-resolve';

import packageJson from "./package.json";

export default {
  input: "./src/index.tsx",

  output: [{
    file: packageJson.main, format: 'cjs', sourcemap: true
  }, {
    file: packageJson.module, format: 'esm', sourcemap: true
  }],

  external: ["react"],

  plugins: [json(), nodeResolve(), commonjs(), getBabelOutputPlugin({
    presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"]
  })]
}
