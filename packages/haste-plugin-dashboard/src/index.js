const Dashboard = require('./dashboard');
const SequenceLoader = require('haste-plugin-loader/src/sequence-logger/sequence-loader');

module.exports = class DashboardPlugin {
  constructor({ frameRate = 60, tasks = [] } = {}) {
    this.frameRate = frameRate;
    this.tasks = tasks;
  }

  apply(runner) {
    const dashboard = new Dashboard({
      tasks: this.tasks,
      maxPanels: 4,
    });

    runner.hooks.beforeExecution.tap('connect dashboard', (execution) => {
      const loader = new SequenceLoader({
        frameRate: this.frameRate,
      });

      loader.render();

      execution.hooks.createTask.tap('start-task', (task) => {
        const log = dashboard.getLogger(task.name);

        task.pool.stdout.setEncoding('utf8');
        task.pool.stderr.setEncoding('utf8');
        // log('hey');
        ['stdout', 'stderr'].forEach(std =>
          task.pool[std].on('data', log),
        );

        task.hooks.before.tap('before-run', (run) => {
          const loaderTask = loader.startTask(task.name);

          run.hooks.success.tap('succeed-run', () => {
            loaderTask.success();
          });

          run.hooks.failure.tap('failed-run', (error) => {
            loaderTask.failure(error);
          });
        });
      });

      execution.hooks.success.tap('finish-success', () => {
        if (!execution.persistent) {
          return loader.done();
        }

        loader.exitAndClear();
        return dashboard.render();
      });

      execution.hooks.failure.tap('finish-failure', (error) => {
        loader.exitOnError(error);
      });
    });
  }
};
