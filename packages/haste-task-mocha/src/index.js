const Mocha = require('mocha');

const clearRequireCache = () => {
  Object.keys(require.cache)
    .filter(key => !key.includes('node_modules'))
    .forEach(key => delete require.cache[key]);
};

module.exports = ({ requireFiles = [], ...options }) => async (files) => {
  const mochaRunner = new Mocha(options);

  requireFiles.forEach(file => require(file));

  files.forEach(({ filename }) => {
    mochaRunner.addFile(filename);
  });

  return new Promise((resolve, reject) => {
    mochaRunner.run((errCount) => {
      clearRequireCache();

      if (errCount > 0) {
        return reject();
      }

      return resolve();
    });
  });
};
