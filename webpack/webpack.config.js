var path = require('path');
var autoprefixer = require('autoprefixer');

require('es6-promise').polyfill();


var config = {
    entry: {
        app: ["../js/app.js", "../scss/app.scss"]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    plugins: [],
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'postcss', 'sass']
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css', 'postcss']
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, "./scss")]
    },
    postcss: function () {
        return [autoprefixer({browsers: ['last 2 versions']})];
    }
};

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractSASS = new ExtractTextPlugin('app.css');

config.plugins = config.plugins.concat([
    extractSASS,
    new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
            warnings: false
        }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
]);

for (var k in [0, 1]) {
    var cssLoaders = config.module.loaders[k].loaders;
    config.module.loaders[k].loaders = null;
    config.module.loaders[k].loader = extractSASS.extract(cssLoaders.slice(1, cssLoaders.length));
}

module.exports = config;