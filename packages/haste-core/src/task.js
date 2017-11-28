const { AsyncSeriesWaterfallHook } = require('tapable');
const { Pool } = require('haste-worker-farm');
const { resolveTaskName } = require('./utils');

const defaultWorkerOptions = {
  cwd: process.cwd(),
};

module.exports = class Task {
  constructor({ farm, name, workerOptions, persistent, context }) {
    this.name = name;
    this.persistent = persistent;
    this.modulePath = resolveTaskName(name, context);

    this.pool = new Pool({
      farm,
      modulePath: this.modulePath,
      workerOptions: { ...defaultWorkerOptions, ...workerOptions },
    });

    const run = async (options) => {
      const newOptions = await this.hooks.before.promise(options);

      try {
        const result = await this.pool.send({ options: newOptions });
        const newResult = await this.hooks.success.promise(result);

        return newResult;
      } catch (error) {
        const newError = await this.hooks.failure.promise(error);

        if (!this.persistent) {
          throw newError;
        }
      }
    };

    this.api = run;

    this.hooks = {
      before: new AsyncSeriesWaterfallHook(['options']),
      success: new AsyncSeriesWaterfallHook(['result']),
      failure: new AsyncSeriesWaterfallHook(['error']),
    };
  }
};
