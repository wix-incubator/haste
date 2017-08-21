const Tapable = require('tapable');
const workerFarm = require('worker-farm');
const Task = require('./task');

const WORKER_BIN = require.resolve('./worker');

module.exports = class Runner extends Tapable {
  constructor() {
    super();

    this.workers = workerFarm(WORKER_BIN);
  }

  run(module, options, context) {
    const task = new Task({ module, options, context });

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
