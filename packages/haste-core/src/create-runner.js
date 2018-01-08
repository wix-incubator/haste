const Runner = require('./runner');
const Logger = require('haste-plugin-logger');

module.exports = ({ plugins = [], logger = new Logger() } = {}) => {
  const runner = new Runner();

  [...plugins, logger].forEach(plugin => plugin.apply(runner));

  return runner;
};
