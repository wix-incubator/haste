const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');

const copyFile = (source, output) => new Promise((resolve, reject) => {
  const done = err => err ? reject(err) : resolve();

  const rd = fs
    .createReadStream(source)
    .on('error', done);

  const wr = fs.createWriteStream(output)
    .on('error', done)
    .on('close', done);

  rd.pipe(wr);
});

const makeDir = name => new Promise((resolve, reject) =>
  mkdirp(name, err => err ? reject(err) : resolve())
);

const readDir = (pattern, options) => new Promise((resolve, reject) =>
  glob(pattern, options, (err, result) => err ? reject(err) : resolve(result))
);

const copyDir = async (pattern, output) => {
  const files = await readDir(pattern);

  await Promise.all(
    files.map(async (file) => {
      const to = path.resolve(output, file);
      console.log(`${file} -> ${output}`);
      await makeDir(path.dirname(to));
      await copyFile(file, to);
    }),
  );
};

module.exports = ({ pattern, output }) => {
  return copyDir(pattern, output);
};
