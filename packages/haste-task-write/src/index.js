const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const makeDir = name => new Promise((resolve, reject) =>
  mkdirp(name, err => err ? reject(err) : resolve())
);

const writeFile = (filename, content) => new Promise(async (resolve, reject) => {
  await makeDir(path.dirname(filename));
  fs.writeFile(filename, content, 'utf8', err => err ? reject(err) : resolve());
});

module.exports = ({ target, base = '' }) => async (files) => {
  return Promise.all(
    files
      .map(({ filename, content }) => {
        return writeFile(path.join(target, filename.replace(base, '')), content);
      })
  );
};
