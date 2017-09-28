const { fork } = require('child_process');
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
    this.tasks = {};
  }

  defineTask(name) {
    const modulePath = resolveTaskName(name, this.context);
    const child = fork(WORKER_BIN, [modulePath], WORKER_OPTIONS);
    const task = new Task({ child, name, modulePath });

    this.applyPlugins('define-task', task);

    return task;
  }

  run(name, options) {
    const task = this.tasks[name] || this.defineTask(name);

    task.applyPlugins('start-task', options);

    task.child.send({ options });

    const promise = new Promise((resolve, reject) =>
      task.child.on('message', ({ result, error }) => error ? reject(error) : resolve(result))
    );

    promise
      .then(result => task.applyPlugins('succeed-task', result))
      .catch(error => task.applyPlugins('failed-task', error));

    return promise;
  }

  watch(pattern, callback) {
    return chokidar.watch(pattern, { ignoreInitial: true, cwd: process.cwd() })
      .on('all', (event, path) => callback(path));
  }
};
