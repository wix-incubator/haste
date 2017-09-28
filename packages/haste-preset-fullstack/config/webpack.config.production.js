const path = require('path');
const paths = require('./paths');

module.exports = {
  entry: paths.entry,
  output: {
    path: path.resolve(paths.appDirectory, paths.build),
    filename: 'statics/js/[name].[chunkhash:8].js'
  }
};
