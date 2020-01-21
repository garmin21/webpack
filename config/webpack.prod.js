const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');	

module.exports = {
  entry: "./src/js/main.js",
  output: {
    filename: "js/[name].[contenthash:10].js",
    path: resolve(__dirname, "../dist"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        // 语法检查
        test: /\.js$/, //只检测js文件
        exclude: /node_modules/, //排除node_modules文件夹
        enforce: "pre", //提前加载使用
        loader: "eslint-loader",
        options: {
          fix: true
        }
      },
      {
        // css 处理
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: loader => [
                require("postcss-import")({ root: loader.resourcePath }),
                require("postcss-preset-env")(),
                require("cssnano")()
              ]
            }
          }
        ]
      },
      {
        // 打包 less
        test: /\.less$/,
        // 当这种文件类型需要一个loader处理，用loader
        // loader: 'less-loader' // 将 Less 编译为 CSS
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: loader => [
                require("postcss-import")({ root: loader.resourcePath }),
                require("postcss-preset-env")(),
                require("cssnano")()
              ]
            }
          },
          "less-loader"
        ]
      },
      {
        // 打包 图片资源
        test: /\.(png|jpg|gif)$/,
        use : [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // 8 * 1024 = 8 kb 小于8kb以下的图片，会被转化成base64
              // [hash:10]取hash值前10位
              // [ext]后缀名。之前文件是什么后缀名，之后就是什么
              name: "[hash:10].[ext]",
              outputPath: "imgs", // path + outputPath --> build/imgs
              esModule: false // 关闭ES6模块化，使用commonjs，解决html img图片出现 [Object Module] 问题
            }
          },
          {
            loader: 'img-loader',
            options: {
              plugins: [
                require('imagemin-gifsicle')({
                  interlaced: false
                }),
                require('imagemin-mozjpeg')({
                  progressive: true,
                  arithmetic: false
                }),
                require('imagemin-pngquant')({
                  floyd: 0.5,
                  speed: 2
                }),
                require('imagemin-svgo')({
                  plugins: [
                    { removeTitle: true },
                    { convertPathData: false }
                  ]
                })
              ]
            }
          }
        ]
      },
      {
        // html 中的图片资源
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        // 字体图标
        test: /\.(eot|svg|ttf|woff)$/,
        loader: "file-loader",
        options: {
          outputPath: "fonts",
          name: "[hash:10].[ext]"
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          // 'thread-loader', // 开启多线程
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // polyfill 按需加载
                    targets: {
                      edge: '17',
                      firefox: '60',
                      chrome: '67',
                      safari: '11.1',
                      ie: '9'
                    },
                    useBuiltIns: 'usage',
                    corejs: {
                      version: 3
                    }
                  }
                ]
              ],
              // 开启babel缓存
              // webpack构建打包速度(第二次)更快
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 打包html
      template: "./src/index.html",
      minify: {
        // 压缩html
        collapseWhitespace: true, // 移除空格
        removeComments: true, // 移除注释
        removeRedundantAttributes: true, // 当值匹配默认值时删除属性。
        removeScriptTypeAttributes: true, // type="text/javascript"从script标签中删除。
        removeStyleLinkTypeAttributes: true, // type="text/css"从style和link标签中删除。
        useShortDoctype: true // 使用HTML5 doctype
    }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // 提取ccs成单独文件
      filename: "css/[name].[contenthash:10].css",
      chunkFilename: "css/[id].[contenthash:10].css"
    }),
    new OptimizeCssAssetsPlugin()
  ],
  mode: "production", // 开发模式
  devtool: "source-map" // 源代码映射
};
