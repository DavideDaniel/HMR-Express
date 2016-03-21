'use strict';
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./config/webpack.config.js');

const port = 3000;

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
	hot: true,
	filename: 'bundle.js',
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler,{
	path: '/__webpack_hmr',
	log: console.log,
	heartbeat: 10 * 1000
}));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(port, function (error) {
  if (error) throw error;

  console.log('server running at http://localhost:', port);
});