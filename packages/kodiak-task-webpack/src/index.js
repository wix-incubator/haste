const webpack = require('webpack');

module.exports = ({ configPath }) => {
  return new Promise((resolve, reject) => {
    const config = require(configPath);
    webpack(config).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      console.log(stats.toString());
      return resolve(stats.toJson());
    });
  });
};
