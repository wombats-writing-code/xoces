var path = require('path');
var webpack = require('webpack')

module.exports = {
   entry: './components/index.js',
   output: {
       path: __dirname + '/dist/',
       filename: 'xoces.js'
   },
   module: {
       loaders: [
         {
           test: /\.js$/, loader: "babel-loader",
           query: {
             plugins: ['transform-decorators-legacy' ],
             presets: ['es2015', 'stage-0'],
           },
           exclude: /(node_modules|bower_components|vendor)/
         },
         {
           test: /\.jsx$/, loader: "babel-loader",
           query: {
             plugins: ['transform-decorators-legacy' ],
             presets: ['es2015','stage-0']
           },
           exclude: /(node_modules|bower_components|vendor)/
	       },
         {
           test: /vendor\/.+\.(jsx|js)$/,
           loader: "imports?this=>window"
         },
         { test: /\.css$/, loader: "style-loader!css-loader" },
          { test: /\.png$/, loader: "url-loader?limit=100000" },
          { test: /\.jpg$/, loader: "file-loader" },
       ]
   },
   resolve: {
     alias: {
       d3: path.resolve(__dirname, './node_modules/d3/build/d3.js'),
     }
   },
    plugins: [
      new webpack.ProvidePlugin({
        'd3': 'd3'
      })
    ]
};
