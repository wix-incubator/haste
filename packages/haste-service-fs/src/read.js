const path = require('path');
const globby = require('globby');
const { readFile } = require('./utils');

module.exports = async ({ pattern, options: { cwd = process.cwd(), ...options } = {} }) => {
  const defaultOptions = { nodir: true };

  const files = await globby(pattern, {
    ...defaultOptions,
    ...options,
    cwd,
  });

  return Promise.all(
    files
      .map((filename) => {
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
