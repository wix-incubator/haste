const Tapable = require('tapable');
const workerFarm = require('worker-farm');
const Task = require('./task');

const WORKER_BIN = require.resolve('./worker');

module.exports = class Runner extends Tapable {
  constructor(context) {
    super();
    this.context = context;
    this.workers = workerFarm(WORKER_BIN);
  }

  run(tasks, plugins) {

  }

  runTask(module, options) {
    this.applyPlugins('start-runner');
    const task = new Task({ module, options, context: this.context });

    const result = new Promise((resolve, reject) =>
      this.workers(task, err => err ? reject(err) : resolve())
    );

    this.applyPlugins('start-task', task);

    return result
      .then(() => task.applyPlugins('succeed-task'))
      .catch((error) => {
        task.applyPlugins('failed-task');

        throw error;
      });
  }
};
