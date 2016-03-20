'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
  name: 'browser',
  devtool: 'inline-source-map',
  entry: ['webpack-hot-middleware/client','./src/main.js'],
  output: {
    path: path.join(__dirname,'../public'),
    filename: 'bundle.js',
    publicPath: '/resources/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    include: path.join(__dirname, '../src'),
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        presets: ['react', 'es2015', 'stage-2','react-hmre'],
        plugins: ['transform-runtime', 'add-module-exports']
      }
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: ["style-loader", "css-loader"]
      }
    ]
  }
}