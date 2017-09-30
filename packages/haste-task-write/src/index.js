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

module.exports = destination => async (input) => {
  return Promise.all(
    input.map(({ filename, content }) => writeFile(path.join(destination, filename), content))
  );
};
