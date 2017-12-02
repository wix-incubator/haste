const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const makeDir = name => new Promise((resolve, reject) =>
  mkdirp(name, err => err ? reject(err) : resolve()),
);

module.exports.writeFile = (filename, content) => new Promise(async (resolve, reject) => {
  await makeDir(path.dirname(filename));
  fs.writeFile(filename, content, 'utf8', err => err ? reject(err) : resolve());
});

module.exports.readFile = file => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf8', (err, data) => err ? reject(err) : resolve(data));
});
