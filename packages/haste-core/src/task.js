const { AsyncSeriesWaterfallHook } = require('tapable');
const { Pool } = require('haste-worker-farm');
const { resolveTaskName } = require('./utils');

module.exports = class Task {
  constructor({ farm, name, workerOptions, persistent, context }) {
    this.name = name;
    this.persistent = persistent;
    this.modulePath = resolveTaskName(name, context);

    this.pool = new Pool({
      farm,
      workerOptions,
      modulePath: this.modulePath,
    });

    process.on('exit', () => {
      this.pool.kill();
    });

    this.api = async (taskOptions, runnerOptions) => {
      const run = {
        taskOptions,
        runnerOptions,
        hooks: {
          success: new AsyncSeriesWaterfallHook(['options']),
          failure: new AsyncSeriesWaterfallHook(['options']),
        },
      };

      await this.hooks.before.promise(run);

      try {
        const result = await this.pool.send({ taskOptions });
        const newResult = await run.hooks.success.promise(result);

        return newResult;
      } catch (error) {
        const newError = await run.hooks.failure.promise(error);

        if (!this.persistent) {
          throw newError;
        }
      }
    };

    this.hooks = {
      before: new AsyncSeriesWaterfallHook(['options']),
    };
  }
};
