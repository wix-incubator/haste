const webpack = require('webpack');

module.exports = ({ configPath, callbackPath }) => () => {
  return new Promise((resolve, reject) => {
    const config = require(configPath);

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
