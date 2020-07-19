var path = require("path");
var webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = (env, options) => {
  const prod = options.mode === "production";
  return {
    entry: "./src/app.ts",
    mode: prod ? "production" : "development",
    output: {
      path: path.resolve(__dirname, "./dist"),
      publicPath: "/dist/",
      libraryTarget: "var",
      filename: "build.js"
    },
    optimization: {
      minimize: prod
    },
    module: {
      rules: [
        {
          test: /three\/examples\/js/,
          use: "imports-loader?THREE=three"
        },
        {
          test: /\.css$/,
          use: ["vue-style-loader", "css-loader"]
        },
        {
          test: /\.scss$/,
          use: [
            "vue-style-loader",
            "css-loader",
            "sass-loader",
            {
              loader: "sass-resources-loader",
              options: {
                // Provide path to the file with resources
                resources: "./styles/_global.scss"
              }
            }
          ]
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
          options: {
            loaders: {
              // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
              // the "scss" and "sass" values for the lang attribute to the right configs here.
              // other preprocessors should work out of the box, no loader config like this necessary.
              scss: "vue-style-loader!css-loader!sass-loader",
              sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax"
            }
            // other vue-loader options go here
          }
        },
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /server/,
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]?[hash]"
          }
        },
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: ["raw-loader", "glslify-loader"]
        },
        {
          // Match woff2 in addition to patterns like .woff?v=1.1.1.
          test: /\.(woff|woff2)$/,
          use: "url-loader"
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          include: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "node_modules")
          ]
          // include: ['src', 'node_modules/webpack-dev-server/client']
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js", ".vue", ".json", ".glsl"],
      alias: {
        vue$: "vue/dist/vue.esm.js",
        "three-examples": path.join(
          __dirname,
          "./node_modules/three/examples/js"
        )
      }
    },

    devServer: {
      historyApiFallback: true,
      noInfo: true
    },
    performance: {
      hints: false
    },
    devtool: prod ? "#source-map" : "#eval-source-map",
    plugins: [
      ...(prod
        ? [
          new webpack.DefinePlugin({
            "process.env": {
              NODE_ENV: '"production"'
            }
          }),
          new webpack.LoaderOptionsPlugin({
            minimize: true
          })
        ]
        : []),
      new VueLoaderPlugin()
    ]
  };
};
