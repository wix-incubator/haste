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
    files.map(async ({ filename, cwd: sourceCwd }) => {
      const absoluteFilePath = path.isAbsolute(filename) ?
        filename : path.join(sourceCwd, filename);
      const absoluteTarget = path.isAbsolute(target) ? target : path.join(cwd, target);
      const absoluteTargetFilePath = path.join(absoluteTarget, filename);

      await makeDir(path.dirname(absoluteTargetFilePath));
      await copyFile(absoluteFilePath, absoluteTargetFilePath);
    })
  );
};
