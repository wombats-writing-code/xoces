let path = require('path')
let webpack = require('webpack')
let _ = require('lodash')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');

const DIST_PATH = path.resolve(__dirname, '../dist')
const SRC_PATH = path.resolve(__dirname, '../src')

let baseConfig = require('./base.config')

let targets = ['umd', 'commonjs2']

let configs = _.map(targets, target => {
  let config =  _.assign({}, baseConfig, {
    output: {
      filename: `xoces-${target}.js`,         // the output bundle
      libraryTarget: target,             // Possible value - amd, commonjs, commonjs2, commonjs-module, this, var
      path: `${DIST_PATH}/umd/`,
      publicPath: '/',                  // necessary for HMR to know where to load the hot update chunks,
      library: 'xoces',
    },
    plugins: _.concat(baseConfig.plugins,  new UglifyJSPlugin(), new WebpackAutoInject() )
  })

  if (target === 'umd') {

  } else {
    config = _.assign({}, config, {
      output: {
        filename: `index.js`,         // the output bundle
        libraryTarget: target,             // Possible value - amd, commonjs, commonjs2, commonjs-module, this, var
        path: DIST_PATH,
        publicPath: '/',                  // necessary for HMR to know where to load the hot update chunks,
        library: 'xoces',
      },
      externals: {
        "lodash": {
            commonjs: "lodash",
            commonjs2: "lodash",
            amd: "lodash",
            root: "_"
        },
        "jquery": {
          commonjs: "jquery",
          commonjs2: "jquery",
          amd: "jquery",
          root: "$"
        },
        "react": {
          commonjs: "react",
          commonjs2: "react",
          amd: "react",
          root: "react"
        },
        "react-dom": {
          commonjs: "react-dom",
          commonjs2: "react-dom",
          amd: "react-dom",
          root: "react-dom"
        },
        "react-redux": {
          commonjs: "react-redux",
          commonjs2: "react-redux",
          amd: "react-redux",
          root: "react-redux"
        },
        "redux": {
          commonjs: "redux",
          commonjs2: "redux",
          amd: "redux",
          root: "redux"
        },
        "d3": {
          commonjs: "d3",
          commonjs2: "d3",
          amd: "d3",
          root: "d3"
        },
      }
    });
  }

  return config
});

module.exports = configs
