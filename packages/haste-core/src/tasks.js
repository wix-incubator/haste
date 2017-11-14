const { camelCaseToDash, isPath } = require('./utils');

module.exports = new Proxy({}, {
  get: (target, prop) => (options, metadata) => {
    return {
      task: isPath(prop) ? prop : camelCaseToDash(prop),
      options,
      metadata,
    };
  }
});

