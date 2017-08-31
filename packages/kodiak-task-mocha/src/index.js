const mocha = require('./mocha');

module.exports = ({ files, watch }) => {
  const options = {
    reporter: 'spec',
    recursive: true,
    watch
  };

  return mocha(options, files);
};
