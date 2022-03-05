const path = require("path");
const {NoEmitOnErrorsPlugin, LoaderOptionsPlugin} = require("webpack");

module.exports = {
  target: "web",

  stats: "errors-only",

  node: {
    __dirname: false, __filename: false,
  },

  resolve: {
    modules: ["node_modules",],

    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],

    alias: {
      "@xiayang/component-editor": path.resolve(__dirname, "../../editor/src")
    }
  },

  module: {
    rules: [{
      test: /\.(js|ts)x?$/, exclude: /(node_modules|\.webpack)/, use: {
        loader: "babel-loader", options: {
          presets: [["@babel/preset-env"], ["@babel/preset-react"], ["@babel/preset-typescript"]],
          plugins: [["@babel/plugin-transform-runtime"],]
        }
      },
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: {loader: "url-loader", options: {limit: 10000, mimetype: "image/svg+xml"}},
    }, {
      test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/, use: "url-loader",
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/i, type: "asset/resource",
    }],
  },

  plugins: [

    new NoEmitOnErrorsPlugin(),

    new LoaderOptionsPlugin({debug: true})

  ]
};


