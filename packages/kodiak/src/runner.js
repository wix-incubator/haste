// @flow
import Tapable from 'tapable';
import workerFarm from 'worker-farm';
import Task from './task';

type Sequence = { task: string, options: Object }[][];

const WORKER_BIN = require.resolve('./worker');

export default class Runner extends Tapable {
  constructor(context: string) {
    super();

    this.context = context;
    this.workers = workerFarm(WORKER_BIN);
  }

  run(tasks: Sequence) {
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

  runTask(module: string, options: Object) {
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
}
