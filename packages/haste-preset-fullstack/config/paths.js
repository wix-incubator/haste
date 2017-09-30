const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  appDirectory,
  build: 'dist',
  target: 'target',
  assets: 'assets',
  src: 'src',
  entry: './src/app.js',
  config: {
    webpack: {
      development: require.resolve('./webpack.config.development'),
      production: require.resolve('./webpack.config.production')
    }
  }
};
