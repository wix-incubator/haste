const express = require('express');

module.exports = ({ port = 9200, hostname, callbackPath }) => () => {
  return new Promise((resolve) => {
    const app = express();
    const callback = require(callbackPath);

    callback(app);

    app.listen(port, hostname, resolve);
  });
};
