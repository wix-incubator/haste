const Runner = require('./runner');

module.exports = context => (action, params) => {
  const runner = new Runner(context);

  const configure = ({ plugins = [], persistent = false }) => {
    runner.persistent = persistent;
    runner.apply(...plugins);
    runner.applyPlugins('start');

    return {
      watch: (...args) => runner.watch(...args),
      run: (...args) => runner.run(...args)
    };
  };

  return action(configure, ...params)
    .then(() => {
      runner.applyPlugins('finish-success');
      runner.done = true;
      return { persistent: runner.persistent };
    })
    .catch((error) => {
      runner.applyPlugins('finish-failure', error);
      throw error;
    });
};
