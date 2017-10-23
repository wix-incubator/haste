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
      .map(({ filename, content, map }) => {
        const promises = [];
        const baseFilename = filename.replace(base, '');
        const outFilename = path.join(target, baseFilename);

        if (map) {
          const mapFilename = `${outFilename}.map`;
          const mapContent = JSON.stringify(map);

          promises.push(
            writeFile(mapFilename, mapContent)
          );

          content += `\n//# sourceMappingURL=${path.basename(mapFilename)}`; // eslint-disable-line no-param-reassign
        }

        promises.push(
          writeFile(outFilename, content)
        );

        return Promise.all(promises);
      })
  );
};
