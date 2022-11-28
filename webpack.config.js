const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// const CompressionPlugin = require("compression-webpack-plugin");

module.exports = function (_env, argv) {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  return {
    devtool: isDevelopment && "cheap-module-source-map",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      // filename: "assets/js/bundle.js",
      filename: "assets/js/bundle.[contenthash].js",
      publicPath: "/",
    },

    // web server
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, "dist"),
      },
      open: true,
      allowedHosts: "all",
      host: "192.168.0.195",
      compress: true,
      https: true,
      port: 8080,
      proxy: {
        "/api": {
          target: "https://192.168.0.195:8080",
          router: () => "http://192.168.0.195:5000",
          secure: false,
        },
        "/images": {
          target: "https://192.168.0.195:8080",
          router: () => "http://192.168.0.195:5000",
          secure: false,
        },
        "/sitemap.xml": {
          target: "https://192.168.0.195:8080",
          router: () => "http://192.168.0.195:5000",
          secure: false,
        },
        "/robots.txt": {
          target: "https://192.168.0.195:8080",
          router: () => "http//192.168.0.195:5000",
          secure: false,
        },
        // "*": {
        //   target: "https://192.168.0.195:8080",
        //   router: () => "http://192.168.0.195:5000",
        //   secure: false,
        // }
      },
    },

    module: {
      rules: [
        {
          test: /\.?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              envName: isProduction ? "production" : "development",
            },
          },
        },

        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: ["@svgr/webpack"],
        },
        {
          test: /\.(png|jp(e*)g|svg|gif)$/,
          exclude: /node_modules/,
          use: {
            loader: "file-loader",
            options: {
              name: "assets/media/[name].[hash:8].[ext]",
            },
          },
        },
        // {
        //   test: /\.(woff|woff2|eot|ttf|otf)$/,
        //   type: 'asset/resource',

        // },
      ],
    },

    resolve: {
      extensions: [".js", ".jsx", ".css"],
    },

    plugins: [
      isProduction &&
        new MiniCssExtractPlugin({
          filename: "assets/css/[name].[contenthash].css",
          // filename: "assets/css/bundle.css",
          chunkFilename: "assets/css/[name].[fullhash:8].css",
        }),

      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
        "process.env.REACT_APP_URL": JSON.stringify(
          "https://pickmyexam.com"
        ),
      }),

      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }),

      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.html"),
        manifest: "./public/manifest.json",
        favicon: "./public/favicon.ico",
        inject: true,
      }),
      new WebpackManifestPlugin({ fileName: "manifest.json" }),
      new NodePolyfillPlugin(),
      // new CompressionPlugin()
    ].filter(Boolean),
  };
};
