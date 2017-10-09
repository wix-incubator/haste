const os = require('os');
const path = require('path');
const uuid = require('uuid/v4');

module.exports = {
  entry: require.resolve('./entry.js'),
  output: {
    path: path.join(os.tmpdir(), uuid()),
    filename: 'bundle.js',
  }
};
