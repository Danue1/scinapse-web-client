const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CheckerPlugin } = require("awesome-typescript-loader");
require("extract-text-webpack-plugin");

module.exports = {
  mode: "development",
  entry: ["babel-polyfill", "./app/clientIndex.tsx"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  optimization: {
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    flagIncludedChunks: false, // production true
    occurrenceOrder: false, // production true
    noEmitOnErrors: false, // production true
    providedExports: true,
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader",
        options: {
          useBabel: true,
          useCache: true,
        },
      },
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader",
        options: {
          classPrefix: false,
          idPrefix: true,
        },
      },
      {
        test: /\.html$/,
        use: ["raw-loader"],
      },
      {
        test: /\.css$/,
        use: ["isomorphic-style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "isomorphic-style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]__[local]__[hash:base64:6]",
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => {
                return [require("precss"), require("autoprefixer"), require("postcss-flexbugs-fixes")];
              },
            },
          },
          { loader: "sass-loader" },
        ],
      },
    ],
  },
  node: {
    fs: "empty",
  },
  externals: {
    "react/lib/ExecutionEnvironment": true,
    "react/lib/ReactContext": true,
    "react/addons": true,
  },
  plugins: [
    new CheckerPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "app/index.ejs",
      inject: false,
      NODE_ENV: "development",
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "app"),
    compress: true,
    host: "0.0.0.0",
    hot: true,
    allowedHosts: ["localhost", "lvh.me"],
  },
};
