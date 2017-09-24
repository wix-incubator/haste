const fs = require('fs');
const path = require('path');
const glob = require('glob');
const babel = require('babel-core');
const mkdirp = require('mkdirp');

const transformFile = (filename, options = {}) => new Promise((resolve, reject) =>
  babel.transformFile(filename, options, (err, result) => err ? reject(err) : resolve(result))
);

const readDir = (pattern, options) => new Promise((resolve, reject) =>
  glob(pattern, options, (err, result) => err ? reject(err) : resolve(result))
);

const makeDir = name => new Promise((resolve, reject) =>
  mkdirp(name, err => err ? reject(err) : resolve())
);

const writeFile = (file, contents) => new Promise(async (resolve, reject) => {
  await makeDir(path.dirname(file));
  fs.writeFile(file, contents, 'utf8', err => err ? reject(err) : resolve());
});

const addSourceMappingUrl = (code, loc) => `${code}\n//# sourceMappingURL=${path.basename(loc)}`;

module.exports = async ({ pattern, output }) => {
  const files = await readDir(pattern);

  const promises = files.map(async (filename) => {
    const fileDest = path.join(output, filename);
    const mapDest = `${fileDest}.map`;

    const data = await transformFile(filename, { sourceMaps: true });
    const code = addSourceMappingUrl(data.code, mapDest);

    return Promise.all([
      writeFile(mapDest, JSON.stringify(data.map)),
      writeFile(fileDest, code),
    ]);
  });

  return Promise.all(promises);
};
