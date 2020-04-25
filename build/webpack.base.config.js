const path = require('path');


const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const envConfig = require('./env.config')
const VueLoaderPlugin = require('vue-loader/lib/plugin')


// const {
//   BundleAnalyzerPlugin
// } = require('webpack-bundle-analyzer');
module.exports = (env) => {
  return {
    mode: env === "production" ? 'production' : 'development',
    context: __dirname,
    entry: {
      // app: ['babel-polyfill', '../src/index.js']
      app: '../src/index.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/'
    },
    node: {
      // Resolve node module use of fs
      fs: 'empty'
    },
    resolve: {
      alias: {
        '@': path.resolve('src'),
      }
    },
    module: {
      rules: [{
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },  {
          test: /\.scss$/,
          use: ['vue-style-loader', 'style-loader', 'css-loader', 'sass-loader']
        }, {
          test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
          use: ['url-loader']
        }, {
          test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }, {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
       
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: '../src/index.html'
      }),
      new webpack.DefinePlugin({
        'process.env': envConfig[env]
      }),
      
    ],
  }
};