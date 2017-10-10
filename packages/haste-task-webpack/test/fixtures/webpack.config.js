const tempy = require('tempy');

module.exports = {
  entry: require.resolve('./entry.js'),
  output: {
    path: tempy.directory(),
    filename: 'bundle.js',
  }
};
