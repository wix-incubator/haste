const { SyncHook, AsyncSeriesWaterfallHook } = require('tapable');
const Task = require('./task');

const defaultWorkerOptions = {
  cwd: process.cwd(),
};

module.exports = class Execution {
  constructor({ action, farm, workerOptions, persistent, context }) {
    this.action = action;
    this.workerOptions = workerOptions;
    this.persistent = persistent;
    this.context = context;
    this.farm = farm;
    this.tasks = [];

    this.hooks = {
      createTask: new SyncHook(['task']),
      before: new AsyncSeriesWaterfallHook(['tasksApi']),
      success: new AsyncSeriesWaterfallHook(['result']),
      failure: new AsyncSeriesWaterfallHook(['error']),
    };
  }

  createTask(name) {
    const task = new Task({
      name,
      farm: this.farm,
      context: this.context,
      persistent: this.persistent,
      workerOptions: { ...defaultWorkerOptions, ...this.workerOptions },
    });

    this.tasks.push(task);

    this.hooks.createTask.call(task);

    return task;
  }

  stop() {
    this.tasks.forEach(task => task.kill());
  }

  async execute() {
    const tasksApi = new Proxy({}, {
      get: (target, name) => {
        if (name === 'then') {
          return null;
        }

        if (target[name]) {
          return target[name];
        }

        const { api } = this.createTask(name);

        return target[name] = api;
      },
    });

    await this.hooks.before.promise(tasksApi);

    try {
      const result = await this.action(tasksApi);
      const newResult = await this.hooks.success.promise(result);

      return newResult;
    } catch (error) {
      const newError = await this.hooks.failure.promise(error);

      throw newError;
    }
  }
};
