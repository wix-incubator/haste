const webpack = require('webpack');

function bundle(webpackConfig) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      console.info(stats.toString());
      return resolve(stats);
    });
  });
}

module.exports = () => {
  const config = {
    entry: './src/app.js',
    output: {
      filename: './dist/bundle.js'
    }
  };

  return bundle(config);
};
