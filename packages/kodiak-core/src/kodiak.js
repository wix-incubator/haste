const { fork } = require('child_process');
const Tapable = require('tapable');
const chokidar = require('chokidar');
const { resolveTaskName } = require('./utils');
const Task = require('./task');

const WORKER_BIN = require.resolve('./worker');
const WORKER_OPTIONS = { silent: true, env: { FORCE_COLOR: true } };

class Runner extends Tapable {}

module.exports = context => (f, params) => {
  const runner = new Runner();

  const define = ({ name }) => {
    const modulePath = resolveTaskName(name, context);
    const child = fork(WORKER_BIN, [modulePath], WORKER_OPTIONS);

    return (options) => {
      const task = new Task({ child, name, modulePath, options });

      runner.applyPlugins('start-task', task);

      child.send({ options });

      const promise = new Promise((resolve, reject) =>
        child.on('message', ({ result, error }) => error ? reject(error) : resolve(result))
      );

      promise
        .then(result => task.applyPlugins('succeed-task', result))
        .catch(error => task.applyPlugins('failed-task', error));

      return promise;
    };
  };

  const watch = (pattern, callback) => {
    return chokidar.watch(pattern, { ignoreInitial: true, cwd: process.cwd() })
      .on('all', (event, path) => callback(path));
  };

  const configure = ({ plugins = [] }) => {
    runner.apply(...plugins);

    return { watch, define };
  };

  return f(configure, ...params);
};
