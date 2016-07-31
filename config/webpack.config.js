'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000', './src/main', './src/remove'],
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'bundle.js',
    publicPath: '/resources/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.join(__dirname, '../src'),
      query: {
        plugins: ['transform-runtime'],
        presets: ['es2015','stage-0']
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
      include: path.join(__dirname, '../src/assets')
    }, ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};