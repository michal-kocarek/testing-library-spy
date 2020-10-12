const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const PnpWebpackPlugin = require("pnp-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index",
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!.*"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      hash: true,
      inject: "head",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    plugins: [PnpWebpackPlugin],
    extensions: [".tsx", ".ts", ".js"],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: require.resolve("ts-loader"),
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          require.resolve("style-loader"),
          require.resolve("css-loader"),
          require.resolve("sass-loader"),
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [require.resolve("url-loader")],
      },
    ],
  },
};
