const Runner = require('./runner');

module.exports = ({ plugins = [] }) => {
  const runner = new Runner();

  runner.apply(...plugins);

  return {
    define: (...args) => runner.define(...args),
  };
};
