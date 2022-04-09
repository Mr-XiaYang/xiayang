import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import alias from "@rollup/plugin-alias";
import replace from "@rollup/plugin-replace";
import {terser} from "rollup-plugin-terser";

import packageConfig from "./package.json";

const dependencies = []
  .concat(Object.keys(packageConfig.dependencies ?? {}))
  .concat(Object.keys(packageConfig.peerDependencies ?? {}))

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const isWatch = process.env.ROLLUP_WATCH === 'true';

export default {
  input: "./src/index.tsx",

  output: {
    dir: './lib', format: 'commonjs', exports: 'named', sourcemap: true, paths: id => id
  },

  external: id => !!dependencies.find(dep => dep === id || id.startsWith(`${dep}/`)),

  plugins: [

    alias(),

    replace({
      preventAssignment: true, values: {
        "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
      }
    }),

    json(),

    resolve({
      rootDir: __dirname, extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
    }),

    commonjs(),

    babel({
      babelHelpers: 'runtime',
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
      presets: [["@babel/preset-env"], ["@babel/preset-typescript"]],
      plugins: [["@babel/plugin-transform-runtime"], ["@babel/plugin-transform-typescript", {allowDeclareFields: true}], ["@babel/plugin-proposal-decorators", {version: "2021-12"}], ["@babel/plugin-proposal-private-methods", {}], ["@babel/plugin-proposal-class-properties", {}],]
    }),

    isProd && terser(),

  ].filter(Boolean),
}
