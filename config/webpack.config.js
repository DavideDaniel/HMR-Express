'use strict';
const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/main',
    output: {
        path: path.join(__dirname,'../public'),
        filename: 'bundle.js',
        publicPath: '/resources/'
    },
    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel'], include: path.join(__dirname, '../src') },
            { test: /\.css$/, loader: 'style-loader!css-loader', include: path.join(__dirname, '../src/assets')},
        ]
    },
    plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
    ]
};