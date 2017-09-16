const copydir = require('copy-dir');

const copyDir = (target, destination) => new Promise((resolve, reject) =>
  copydir(target, destination, err => err ? reject(err) : resolve())
);

module.exports = ({ target, destination }) => {
  return copyDir(target, destination);
};
