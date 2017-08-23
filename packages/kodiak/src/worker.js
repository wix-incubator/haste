// @flow
const resolveFrom = require('resolve-from');
const { asyncToCallback } = require('./utils');

function handle({ module, options, context }) {
  const modulePath = resolveFrom(context, module);
  return require(modulePath)(options);
}

module.exports = asyncToCallback(handle);
