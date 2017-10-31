const tempy = require('tempy');

module.exports = {
  entry: require.resolve('./invalid-javascript.js'),
  output: {
    path: tempy.directory(),
    filename: 'bundle.js',
  }
};
