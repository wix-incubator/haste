const Runner = require('./runner');

module.exports = ({ plugins = [] } = {}) => {
  const runner = new Runner();

  plugins.forEach(plugin => plugin.apply(runner));

  return {
    define: (...args) => runner.define(...args),
    watch: (...args) => runner.watch(...args),
  };
};
