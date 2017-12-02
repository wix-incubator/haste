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

    this.api = async (options) => {
      const run = {
        options,
        hooks: {
          success: new AsyncSeriesWaterfallHook(['options']),
          failure: new AsyncSeriesWaterfallHook(['options']),
        },
      };

      await this.hooks.before.promise(run);

      try {
        const result = await this.pool.send({ options });
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
