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

module.exports = ({ complete, error, idle }, { plugins }, { send, listen }) => {
  const baseConfig = {
    entry: './src/app.js',
    output: {
      filename: './dist/bundle.js'
    }
  };

  const config = plugins
    .map(require)
    .reduce((webpackConfig, plugin) => plugin(webpackConfig), baseConfig);

  webpack(config).watch({}, (err, stats) => {
    send({ hello: 'world' });

    if (err) {
      return console.log(err);
    }

    console.info(stats.toString());
    return idle();
  });

  // return bundle(config)
  //   .then(complete)
  //   .catch(error);
};
