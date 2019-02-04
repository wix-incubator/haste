const Runner = require('./runner');
const Logger = require('haste-plugin-logger');

module.exports = ({ plugins = [], logger = new Logger(), maxConcurrentCalls } = {}) => {
  const runner = new Runner({ maxConcurrentCalls });

  [...plugins, logger].forEach(plugin => plugin.apply(runner));

  return runner;
};
