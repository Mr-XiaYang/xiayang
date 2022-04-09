const {EnvironmentPlugin} = require("webpack");
const {merge} = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const configuration = require("./webpack.config.base");
const path = require("path");

module.exports = merge(configuration, {
  mode: "development",

  devtool: 'inline-source-map',

  entry: ["regenerator-runtime/runtime", "core-js", path.join(__dirname, "..", "src/index.tsx")],

  optimization: {
    minimize: true, minimizer: [new TerserPlugin({parallel: true}), new CssMinimizerPlugin(),],
  },

  module: {
    rules: [
      {
        test: /\.s?css$/,
        include: /\.module\.s?(c|a)ss$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {loader: "css-loader", options: {modules: true, sourceMap: true, importLoaders: 1}},
          {loader: "sass-loader"},
        ],
      }, {
        test: /\.s?css$/,
        exclude: /\.module\.s?(c|a)ss$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {loader: "css-loader"},
          {loader: "sass-loader"},
        ],
      },
    ]
  },

  plugins: [new EnvironmentPlugin({
    NODE_ENV: "development", OPEN_ANALYZER: "false", DEBUG_PROD: "false",
  }),

    new BundleAnalyzerPlugin({
      openAnalyzer: process.env.OPEN_ANALYZER === "true",
      analyzerMode: process.env.OPEN_ANALYZER === "true" ? "server" : "disabled",
    }),

    new MiniCssExtractPlugin({filename: "style.css"})],
});


