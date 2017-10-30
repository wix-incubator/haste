const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');

module.exports = ({ configPath, callbackPath, decoratorPath, port = 9200, hostname = 'localhost' }) => () => {
  return new Promise((resolve) => {
    const app = express();
    const config = require(configPath);
    const compiler = webpack(config);

    if (callbackPath) {
      require(callbackPath)(compiler);
    }

    app.use(webpackDevMiddleware(compiler));

    if (decoratorPath) {
      require(decoratorPath)(app);
    }

    app.listen(port, hostname, resolve);
  });
};
