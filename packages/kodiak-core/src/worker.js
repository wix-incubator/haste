const { asyncToCallback } = require('./utils');

function handle({ module, options }) {
  return require(module)(options);
}

module.exports = asyncToCallback(handle);
