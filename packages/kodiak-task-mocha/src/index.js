const mocha = require('./mocha');

module.exports = async ({ files, watch }) => {
  const options = {
    reporter: 'spec',
    recursive: true,
    watch
  };

  return mocha(options, files);
};
