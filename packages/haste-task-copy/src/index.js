const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const makeDir = name => new Promise((resolve, reject) =>
  mkdirp(name, err => err ? reject(err) : resolve())
);

const copyFile = (source, target) => new Promise((resolve, reject) => {
  const done = err => err ? reject(err) : resolve();

  const rd = fs.createReadStream(source)
    .on('error', done);

  const wr = fs.createWriteStream(target)
    .on('error', done)
    .on('close', done);

  rd.pipe(wr);
});

module.exports = ({ cwd = process.cwd(), target }) => async (files) => {
  return Promise.all(
    files.map(async ({ filename }) => {
      const absoluteFilePath = path.join(cwd, filename);
      const absoluteTargetFilePath = path.join(path.isAbsolute(target) ? '' : cwd, target, filename);

      await makeDir(path.dirname(absoluteTargetFilePath));
      await copyFile(absoluteFilePath, absoluteTargetFilePath);
    })
  );
};
