import {DEFAULT_EXTENSIONS} from "@babel/core"
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import babel from "@rollup/plugin-babel";
import nodeResolve from '@rollup/plugin-node-resolve';

import packageJson from "./package.json";

const extensions = [...DEFAULT_EXTENSIONS, '.ts', ".tsx"];

export default {
  input: "./src/index.ts",

  output: [{
    file: packageJson.main, format: 'cjs', exports: 'named', sourcemap: true
  }, {
    file: packageJson.module, format: 'es', exports: 'named', sourcemap: true
  }],

  external: id => !!(packageJson.peerDependencies ? Object.keys(packageJson.peerDependencies) : []).find(dep => {
    return dep === id || id.startsWith(`${dep}/`)
  }),

  plugins: [

    json(),

    commonjs({
      exclude: ['./src/**']
    }),

    nodeResolve({
      extensions, moduleDirectories: ['node_modules']
    }),

    babel({
      extensions, include: ['./src/**'], babelHelpers: 'runtime',

      presets: [["@babel/preset-env", {
        targets: {node: "current"}, modules: false
      }], ["@babel/preset-react"], ["@babel/preset-typescript"]],

      plugins: [["@babel/plugin-transform-runtime", {
        regenerator: false, useESModules: true,
      }]]
    })

  ]
}
