var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./config/webpack.config.js');

var port = 3000;

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
	hot: true,
	debug:true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(port, function (error) {
  if (error) throw error;

  console.log('server running at http://localhost:', port);
});