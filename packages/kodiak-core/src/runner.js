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
    this.apply(...plugins);
    this.applyPlugins('start', tasks);

    const runTasks = (promise, tasksArray) =>
      promise.then((previous) => {
        const promises = tasksArray
          .map(({ task, options }) => this.runTask(task, options))
          .map(task => task.catch(e => e));

        return Promise.all(promises)
          .then(errors => [...errors, ...previous]);
      });

    return tasks.reduce(runTasks, Promise.resolve([]))
      .then((errors) => {
        if (errors.length) this.applyPlugins('finish-with-errors', errors);
        else this.applyPlugins('finish-without-errors');
        return errors;
      });
  }

  runTask(module, options) {
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
