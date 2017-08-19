const mocha = require('./mocha');

module.exports = async () => {
  const options = {
    reporter: 'spec',
    ui: 'tdd',
    bail: true,
    recursive: true,
  };

  return mocha(options);
};
