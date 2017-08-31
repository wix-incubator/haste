const mocha = require('./mocha');

module.exports = ({ complete, error }, { files, watch }) => {
  const options = {
    reporter: 'spec',
    recursive: true,
    watch
  };

  return mocha(options, files)
    .then(complete)
    .catch(error);
};
