const Runner = require('./runner');

module.exports = context => (action, params) => {
  const runner = new Runner(context);

  const configure = ({ plugins = [] }) => {
    runner.apply(...plugins);

    return {
      watch: (...args) => runner.watch(...args),
      define: (...args) => runner.define(...args),
    };
  };

  return action(configure, ...params);
};
