const webpack = require('webpack');

module.exports = ({ configPath, callbackPath, configParams = {} }) => () => {
  return new Promise((resolve, reject) => {
    let config = require(configPath);

    if (typeof config === 'function') {
      config = config(configParams);
    }

    webpack(config).run((err, stats) => {
      if (callbackPath) {
        require(callbackPath)(err, stats);
      }

      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        const errorMessage = stats.toJson().errors.reduce((message, error) => {
          return message + error.toString();
        }, '');

        return reject(errorMessage);
      }

      return resolve(stats.toJson());
    });
  });
};
