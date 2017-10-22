const path = require('path');
const Mocha = require('mocha');

module.exports = ({ requireFiles = [], ...options }) => async (files) => {
  const mochaRunner = new Mocha(options);

  requireFiles.forEach(file => require(file));

  files.forEach(({ filename }) => {
    mochaRunner.addFile(filename);
  });

  return new Promise((resolve, reject) => {
    mochaRunner.run((errCount) => {
      files.forEach(({ filename }) => {
        delete require.cache[path.resolve(filename)];
      });

      if (errCount > 0) {
        return reject();
      }

      return resolve();
    });
  });
};
