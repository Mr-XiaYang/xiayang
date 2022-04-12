import sucrase from "@rollup/plugin-sucrase"
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from "@rollup/plugin-replace";
import dts from 'rollup-plugin-dts'

import packageConfig from "./package.json";

const dependencies = []
  .concat(Object.keys(packageConfig.dependencies ?? {}))
  .concat(Object.keys(packageConfig.peerDependencies ?? {}))

const config = [{
  input: "./src/index.tsx",

  onwarn: (warning) => {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
      console.warn(`(!) ${warning.message}`) // eslint-disable-line no-console
    } else {
      console.info(`(!) ${warning.message}`) // eslint-disable-line no-console
    }
  },

  external: id => !!dependencies.find(dep => dep === id || id.startsWith(`${dep}/`)),

  output: [{
    file: packageConfig.main, format: 'cjs', exports: 'named', sourcemap: true
  }, {
    file: packageConfig.module, format: 'es', exports: 'named', sourcemap: true,
  },],


  plugins: [

    resolve({
      rootDir: __dirname, extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
    }),

    commonjs(),

    json(),

    replace({
      preventAssignment: true, values: {
        "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
      }
    }),

    sucrase({
      exclude: ['node_modules/**'], transforms: ["typescript", "jsx"],
    }),

  ].filter(Boolean),
}, {
  input: "./types/index.d.ts", output: {file: packageConfig.typings, format: "es"}, plugins: [dts()],
}]

export default config;
