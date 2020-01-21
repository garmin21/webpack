const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/js/main.js",
  output: {
    filename: "./js/bundel.js",
    publicPath: '/'
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
        use: ["style-loader", "css-loader"]
      },
      {
        // 打包 less
        test: /\.less$/,
        // 当这种文件类型需要一个loader处理，用loader
        // loader: 'less-loader' // 将 Less 编译为 CSS
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        // 打包 图片资源
        test: /\.(png|jpg|gif)$/,
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 打包html
      template: "./src/index.html"
    })
  ],
  mode: "development", // 开发模式
  devtool: "source-map" // 源代码映射
};
