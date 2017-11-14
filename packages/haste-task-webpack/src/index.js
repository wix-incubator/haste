const webpack = require('webpack');

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    const handler = (err, stats) => {
      if (options.callbackPath) {
        require(options.callbackPath)(err, stats);
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
    };

    let config = require(options.configPath);

    if (typeof config === 'function') {
      config = config(options.configParams);
    }

    const compiler = webpack(config);

    if (options.watch) {
      return compiler.watch(options.watchOptions, handler);
    }

    return compiler.run(handler);
  });
};
