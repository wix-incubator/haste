const Runner = require('./runner');

module.exports = context => (action, params) => {
  const runner = new Runner(context);

  const configure = ({ plugins = [] }) => {
    runner.apply(...plugins);
    runner.applyPlugins('start');

    return {
      watch: (...args) => runner.watch(...args),
      define: (...args) => runner.define(...args),
      run: (...args) => runner.run(...args),
    };
  };

  return action(configure, ...params)
    .then((result) => {
      runner.applyPlugins('finish-success', result);
      return result;
    })
    .catch((error) => {
      runner.applyPlugins('finish-failure', error);
      throw error;
    });
};
