const os = require('os');
const chokidar = require('chokidar');
const { AsyncSeriesHook } = require('tapable');
const { Farm } = require('haste-worker-farm');
const Execution = require('./execution');

module.exports = class Runner {
  constructor() {
    this.farm = new Farm({ maxConcurrentCalls: os.cpus().length });
    this.executions = [];

    this.hooks = {
      beforeExecution: new AsyncSeriesHook(['execution']),
    };

    process.on('exit', () => this.kill());
  }

  command(action, { persistent = false } = {}) {
    return async ({ context, workerOptions } = {}) => {
      const execution = new Execution({
        action,
        context,
        persistent,
        workerOptions,
        farm: this.farm,
      });

      this.executions.push(execution);

      await this.hooks.beforeExecution.promise(execution);

      const result = await execution.execute();

      return {
        result,
        persistent,
      };
    };
  }

  kill() {
    this.executions.forEach(execution => execution.stop());
  }

  watch({ pattern, cwd = process.cwd(), ignoreInitial = true }, callback) {
    const watcher = chokidar.watch(pattern, { ignoreInitial, cwd })
      .on('all', (event, path) => callback(path));

    return watcher;
  }
};
