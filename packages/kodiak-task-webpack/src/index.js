const webpack = require('webpack');

function bundle(webpackConfig) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      console.info(stats.toString());
      return resolve();
    });
  });
}

module.exports = ({ plugins }) => {
  const baseConfig = {
    entry: './src/app.js',
    output: {
      filename: './dist/bundle.js'
    }
  };

  const config = plugins
    .map(require)
    .reduce((webpackConfig, plugin) => plugin(webpackConfig), baseConfig);

  return bundle(config);
};
