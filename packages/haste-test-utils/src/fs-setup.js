const path = require('path');
const fs = require('fs-extra');
const tempy = require('tempy');

module.exports = (fsObject) => {
  const cwd = tempy.directory();

  Object.keys(fsObject).forEach((filename) => {
    fs.outputFileSync(path.join(cwd, filename), fsObject[filename]);
  });

  const files = new Proxy({}, {
    get: (target, prop) => {
      return fs.readFileSync(path.join(cwd, prop), 'utf8');
    }
  });

  return {
    cwd,
    files,
  };
};
