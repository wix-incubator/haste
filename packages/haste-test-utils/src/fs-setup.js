const path = require('path');
const fs = require('fs-extra');
const tempy = require('tempy');

module.exports = (fsObject = {}) => {
  const cwd = tempy.directory();

  Object.keys(fsObject).forEach((filename) => {
    fs.outputFileSync(path.join(cwd, filename), fsObject[filename]);
  });

  const createFileObject = (filename) => {
    return new Proxy({}, {
      get: (target, prop) => {
        const fullPath = path.join(cwd, filename);

        switch (prop) {
          case 'content':
            return fs.readFileSync(fullPath, 'utf8');

          case 'exists':
            return fs.existsSync(fullPath);

          case 'path':
            return fullPath;

          default:
            return undefined;
        }
      },
    });
  };

  const files = new Proxy({}, {
    get: (target, prop) => createFileObject(prop),
  });

  return {
    cwd,
    files,
  };
};
