'use strict';
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const modeEnv = process.env.NODE_ENV != "production" ? process.env.NODE_ENV != "testing" ? "" : "-test/" : "-production/";
// const jdxlEnv = process.env.NODE_ENV != "production" ? process.env.NODE_ENV != "testing" ? "" : "jdxl_test" : "jdxl_prod";
module.exports = (env) => {
  return merge(baseWebpackConfig(env), {
    // cheap-module-eval-source-map is faster for development
    devtool: 'cheap-module-eval-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CopyWebpackPlugin([{
        from: '../public',
        to: ''
      }])
    ],
    // these devServer options should be customized in /config/index.js
    devServer: {
      contentBase: path.join(__dirname, "public"),
      clientLogLevel: 'warning',
      historyApiFallback: true,
      hot: true,
      // host: HOST,
      // port: PORT,
      open: false,
      overlay: {
        warnings: false,
        errors: true
      },
      proxy: {
        // 引用开发环境的 WindEarth 地址
        '/vendors': {
          ws: false,
          target: "http://52.83.252.242:7000/V1.1.1",
          changeOrigin: true,
          pathRewrite: {
            "^/vendors": ""
          }
        },
        '/v2': {
          ws: false,
          target: "http://10.35.190.58:5001/v2",
          changeOrigin: true,
          pathRewrite: {
            "^/v2": ""
          }
        },
        
        '/section': {
          ws: false,
          // target: "http://1.202.243.97:8008",
          target: "http://10.12.3.135:6500",
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            "^/section": ""
          }
        },
        '/goldLab': {
          ws: false,
          target: "http://wind-java-be.windlab.wrinternal.goldwind.com.cn",
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            "^/goldLab": ""
          }
        },
        '/geocode': {
          ws: false,
          target: 'http://restapi.amap.com/v3',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/geocode': ''
          }
        },
        '/elevation': {
          ws: false,
          target: 'http://10.35.191.98:5000',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/elevation': ''
          }
        },
        '/s3path': {
          ws: false,
          target: 'https://goldfarm-dev.s3.cn-northwest-1.amazonaws.com.cn',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/s3path': ''
          }
        }
      },
      watchOptions: {
        poll: false
      }
    }
  })
};