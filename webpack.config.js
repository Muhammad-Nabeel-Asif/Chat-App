const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/test.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, "src")],
        use: "ts-loader",
        // exclude: [path.resolve(__dirname, "node_modules")],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: "eval-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    liveReload: true,
    compress: true,
    port: 9000,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
  output: {
    // filename: "[name][contenthash].js",
    publicPath: "public",
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
};
