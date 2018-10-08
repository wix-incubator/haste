const webpack = require('webpack');
const bfj = require('bfj');

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    const handler = async (err, stats) => {
      if (options.callbackPath) {
        require(options.callbackPath)(err, stats);
      }

      if (err) {
        return reject(err);
      }

      const statsJson = stats.toJson();

      if (stats.hasErrors()) {
        const errorMessage = statsJson.errors.reduce((message, error) => {
          return message + error.toString();
        }, '');

        return reject(errorMessage);
      }

      if (options.statsFilename) {
        await bfj.write(options.statsFilename, statsJson);
      }

      return resolve(statsJson);
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
