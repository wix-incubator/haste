const { fork } = require('child_process');
const Tapable = require('tapable');
const Task = require('./task');

const WORKER_BIN = require.resolve('./worker');

module.exports = class Runner extends Tapable {
  run(tasks) {
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
        errors.length ?
          this.applyPlugins('finish-with-errors', errors) :
          this.applyPlugins('finish-without-errors');

        return errors;
      });
  }

  runTask(module, options) {
    const child = fork(WORKER_BIN, [], { silent: true, env: { FORCE_COLOR: true } });

    child.send({ module, options });

    const result = new Promise((resolve, reject) => {
      child.on('message', ({ success }) => success ? resolve() : reject());
    });

    process.on('exit', () => {
      child.kill('SIGINT');
    });

    const task = new Task({ module, options, child });

    this.applyPlugins('start-task', task);

    return result
      .then(() => task.applyPlugins('succeed-task'))
      .catch((error) => {
        task.applyPlugins('failed-task');

        throw error;
      });
  }
};
