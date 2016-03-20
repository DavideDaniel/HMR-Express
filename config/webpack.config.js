'use strict';
const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:1337',
        'webpack/hot/dev-server',
        './src/main'
    ],
    output: {
        path: path.join(__dirname,'../public'),
        filename: 'bundle.js',
        publicPath: '/resources/'
    },
    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel'], include: path.join(__dirname, '../src') },
            { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader?sourceMap', include: path.join(__dirname, '../src/assets')},
            { test: /\.css$/, loader: 'style-loader!css-loader?sourceMap', include: path.join(__dirname, '../src/assets')},
        ]
    },
    plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
    ]
};