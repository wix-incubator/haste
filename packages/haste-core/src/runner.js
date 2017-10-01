const { fork } = require('child_process');
const uuid = require('uuid/v1');
const Tapable = require('tapable');
const chokidar = require('chokidar');
const { resolveTaskName } = require('./utils');
const Task = require('./task');

const WORKER_BIN = require.resolve('./worker');
const WORKER_OPTIONS = { silent: true, env: { FORCE_COLOR: true } };

module.exports = class Runner extends Tapable {
  constructor(context) {
    super();
    this.context = context;
  }

  define(name) {
    const modulePath = resolveTaskName(name, this.context);
    const child = fork(WORKER_BIN, [modulePath], WORKER_OPTIONS);
    const task = new Task({ child, name, modulePath });

    this.applyPlugins('define-task', task);

    return options => (input) => {
      task.applyPlugins('start-task', options);

      const callId = uuid();

      task.child.send({ options, input, id: callId });

      const promise = new Promise((resolve, reject) =>
        task.child.on('message', ({ result, error, id }) => {
          if (id === callId) {
            error ? reject(error) : resolve(result);
          }
        })
      );

      promise
        .then(result => task.applyPlugins('succeed-task', result))
        .catch(error => task.applyPlugins('failed-task', error));

      return promise;
    };
  }

  run(...tasks) {
    return tasks.reduce((promise, task) => {
      return promise.then(input => task(input));
    }, Promise.resolve());
  }

  watch(pattern, callback) {
    return chokidar.watch(pattern, { ignoreInitial: true, cwd: process.cwd() })
      .on('all', (event, path) => callback(path));
  }
};
