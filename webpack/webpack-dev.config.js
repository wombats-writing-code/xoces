let path = require('path')
let webpack = require('webpack')
let _ = require('lodash')

const DIST_PATH = path.resolve(__dirname, '../dist')
const SRC_PATH = path.resolve(__dirname, '../src')

let baseConfig = require('./base.config')

let config = _.assign({}, baseConfig, {
  entry: _.concat([
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
  ], baseConfig.entry),
  devtool: 'inline-source-map',
  devServer: {
    hot: true, // enable HMR on the server
    contentBase: DIST_PATH,
    publicPath: '/',  // match the output `publicPath`
    port: 8080,
    historyApiFallback: {
      index: './index.html'
    }
  },
});

// enable HMR globally
config.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = config;
