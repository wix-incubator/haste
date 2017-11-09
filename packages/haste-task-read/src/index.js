const fs = require('fs');
const path = require('path');
const globby = require('globby');

const defaultOptions = { nodir: true };

const readFile = file => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf8', (err, data) => err ? reject(err) : resolve(data));
});

module.exports = ({ pattern, options: { cwd = process.cwd(), ...options } = {} }) => async () => {
  const files = await globby(pattern, {
    ...defaultOptions,
    ...options,
    cwd,
  });

  return Promise.all(
    files
      .map(filename => path.isAbsolute(filename) ? filename : path.join(cwd, filename))
      .map((filename) => {
        return readFile(filename)
          .then((content) => {
            return {
              content,
              filename,
              cwd,
            };
          });
      })
  );
};
