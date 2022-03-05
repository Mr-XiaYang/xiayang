const path = require("path");
const {merge} = require("webpack-merge");
const {EnvironmentPlugin} = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const configuration = require("./webpack.config.base");

const port = process.env.PORT ?? 8080;

module.exports = merge(configuration, {
  mode: "development",

  devtool: 'inline-source-map',

  entry: [`webpack-dev-server/client?http://localhost:${port}/dist`, "webpack/hot/only-dev-server", "regenerator-runtime/runtime", "core-js", path.join(__dirname, "..", "src/index.tsx")],

  module: {
    rules: [{
      test: /\.s?css$/, include: /\.module\.s?(c|a)ss$/, use: [{loader: "style-loader"}, {
        loader: "css-loader", options: {modules: true, sourceMap: true, importLoaders: 1}
      }, {loader: "sass-loader"},],
    }, {
      test: /\.s?css$/,
      exclude: /\.module\.s?(c|a)ss$/,
      use: [{loader: "style-loader"}, {loader: "css-loader"}, {loader: "sass-loader"},],
    },]
  },

  plugins: [new EnvironmentPlugin({
    NODE_ENV: "development", OPEN_ANALYZER: "false", DEBUG_PROD: "false",
  }),

    new BundleAnalyzerPlugin({
      openAnalyzer: process.env.OPEN_ANALYZER === "true",
      analyzerMode: process.env.OPEN_ANALYZER === "true" ? "server" : "disabled",
    }),

    new ReactRefreshWebpackPlugin(),

    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, "..", "index.ejs"),
      env: process.env.NODE_ENV,
      minify: {
        collapseWhitespace: true, removeAttributeQuotes: true, removeComments: true,
      },
      isBrowser: false,
      isDevelopment: true,
      nodeModules: path.join(__dirname, "..", "node_modules"),
    }),

  ],

  devServer: {
    port,
    hot: true,
    compress: true,

    headers: {'Access-Control-Allow-Origin': '*'}, static: {
      publicPath: '/',
    },

    historyApiFallback: {
      verbose: true, disableDotRule: false,
    },
  }
});


