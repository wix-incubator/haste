const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const makeDir = name => new Promise((resolve, reject) =>
  mkdirp(name, err => err ? reject(err) : resolve()),
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

module.exports = async ({ pattern, target, cwd = process.cwd(), source }, { fs: fsService }) => {
  const files = await fsService.read({ pattern, cwd, source });

  return Promise.all(
    files.map(async ({ filename, cwd: sourceCwd }) => {
      const absoluteSourcePath = path.isAbsolute(filename) ?
        filename :
        path.join(sourceCwd, filename);

      const absoluteTarget = path.isAbsolute(target) ? target : path.join(cwd, target);
      const absoluteTargetFilePath = path.join(absoluteTarget, filename);

      await makeDir(path.dirname(absoluteTargetFilePath));
      await copyFile(absoluteSourcePath, absoluteTargetFilePath);
    }),
  );
};
