let path = require('path')
let webpack = require('webpack')

const DIST_PATH = path.resolve(__dirname, '../dist')
const SRC_PATH = path.resolve(__dirname, '../src')

module.exports = {
  entry: [
    './index.js'
    // the entry point of our app
  ],
  output: {
    filename: 'xoces-umd.js',         // the output bundle
    libraryTarget: 'umd',             // Possible value - amd, commonjs, commonjs2, commonjs-module, this, var
    path: DIST_PATH,
    publicPath: '/',                  // necessary for HMR to know where to load the hot update chunks,
    library: 'xoces',
  },
  context: SRC_PATH,

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [ 'babel-loader', ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader', 'postcss-loader', ],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader', ]
      },
      { test: /\.png$/, loader: "url-loader?mimetype=image/png" }
    ],
  },

  plugins: [
    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
  ],
};
