const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CLIENT_PATH = path.resolve(__dirname, "./dist");
const HtmlWebpackPlugin = require("html-webpack-plugin");

console.log("== mode: ", process.env.NODE_ENV);

/** @const {webpack.Configuration} */
const config = {
  target: "web",
  entry: [path.resolve(__dirname, "./app.tsx")],
  resolve: {
    modules: [path.resolve(__dirname, "node_modules")],
    extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".css"]
  },
  output: {
    path: CLIENT_PATH,
    publicPath: "/",
    filename: "[name][contenthash:8].js",
    chunkFilename: "[name][contenthash:8].js"
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(mjs|jsx?)$/,
        use: "babel-loader"
      },
      {
        test: /\.tsx?$/,
        use: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(woff|woff2)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin()]
};

const devConfig = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: [CLIENT_PATH],
    historyApiFallback: {
      index: "/index.html",
      rewrites: [{ from: /\.html?$/, to: "/index.html" }]
    },
    port: 4001,
    host: "0.0.0.0",
    disableHostCheck: true
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: [/node_modules/],
        use: "source-map-loader"
      }
    ]
  }
};

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name][contenthash:9].js",
    chunkFilename: "[name][contenthash:9].js"
  }
};

/**
 * @return {webpack.Configuration}
 */
module.exports = () =>
  merge(
    config,
    process.env.NODE_ENV === "development" ? devConfig : prodConfig
  );
