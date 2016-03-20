'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./config/webpack.dev.config.js');

const app = express();
const compiler = webpack(config);
const port = 3000;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:'+port);
});