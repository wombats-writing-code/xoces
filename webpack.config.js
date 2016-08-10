var webpack = require("webpack");
var path = require("path");

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'bundle.js', //this is the default name, so you can skip it
        //at this directory our bundle file will be available
        //make sure port 8090 is used when launching webpack-dev-server
        publicPath: 'http://localhost:8090/assets'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
		{
		test: /\.scss$/,
		loader: 'style!css!sass'
		},
		{ test: /\.png$/, loader: "url-loader?limit=100000&mimetype=image/png" },
		{ test: /\.jpg$/, loader: "file-loader" },
        ]
    },
	plugins: [
		new webpack.optimize.DedupePlugin(),
		new webpack.ProvidePlugin({
		})
	],
    externals: {
    },
    resolve: {
	alias: {
	},
        extensions: ['', '.js']
    }
}
