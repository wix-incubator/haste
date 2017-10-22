const chokidar = require('chokidar');
const Runner = require('./runner');
const { camelCaseToDash, isPath } = require('./utils');

const watch = (pattern, callback) => {
  const watcher = chokidar.watch(pattern, { ignoreInitial: true, cwd: process.cwd() })
    .on('all', (event, path) => callback(path));

  return watcher;
};

const tasks = new Proxy({}, {
  get: (target, prop) => (options, metadata) => {
    return {
      task: isPath(prop) ? prop : camelCaseToDash(prop),
      options,
      metadata,
    };
  }
});

module.exports = context => (action, params = []) => {
  const runner = new Runner(context);

  const configure = ({ plugins = [], persistent = false } = {}) => {
    runner.persistent = persistent;

    runner.apply(...plugins);
    runner.applyPlugins('start');

    return {
      tasks,
      watch,
      run: (...args) => runner.run(...args),
      close: (...args) => runner.close(...args),
    };
  };

  return action(configure, ...params)
    .then(() => {
      runner.done = true;
      runner.applyPlugins('finish-success');

      return { persistent: runner.persistent };
    })
    .catch((error) => {
      runner.applyPlugins('finish-failure', error);

      throw error;
    });
};
