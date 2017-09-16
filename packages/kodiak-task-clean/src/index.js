const rimraf = require('rimraf');

const cleanDir = (pattern, options) => new Promise((resolve, reject) =>
  rimraf(pattern, { glob: options }, (err, result) => err ? reject(err) : resolve(result))
);

module.exports = ({ pattern, options }) => {
  return cleanDir(pattern, options);
};
