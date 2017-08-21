const { asyncToCallback } = require('./utils');

function handle({ module, args }) {
  return require(module)(args);
}

module.exports = asyncToCallback(handle);
