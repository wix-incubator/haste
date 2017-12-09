const Runner = require('./runner');

module.exports = ({ plugins = [] } = {}) => {
  const runner = new Runner();

  plugins.forEach(plugin => plugin.apply(runner));

  return {
    command: (...args) => runner.command(...args),
    watch: (...args) => runner.watch(...args),
  };
};
