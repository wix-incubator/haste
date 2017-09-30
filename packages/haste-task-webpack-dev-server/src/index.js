const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');

module.exports = ({ configPath, port = 9200, hostname = 'localhost' }) => () => {
  return new Promise((resolve) => {
    const app = express();
    const config = require(configPath);
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler));
    app.listen(port, hostname, resolve);
  });
};
