const path = require('path');
const globby = require('globby');
const { readFile } = require('./utils');

module.exports = async ({ pattern, source, cwd = process.cwd(), options } = {}) => {
  if (source) {
    cwd = path.isAbsolute(source) ? source : path.join(cwd, source);
  }

  const defaultOptions = { onlyFiles: true, ignore: ['**/node_modules'] };

  const files = await globby(pattern, {
    ...defaultOptions,
    cwd,
    ...options,
  });

  return Promise.all(
    files.map((filename) => {
      const absoluteFilePath = path.isAbsolute(filename) ? filename : path.join(cwd, filename);

      return readFile(absoluteFilePath)
        .then((content) => {
          return {
            content,
            filename,
            cwd,
          };
        });
    }),
  );
};
