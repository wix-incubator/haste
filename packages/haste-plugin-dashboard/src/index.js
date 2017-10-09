const Dashboard = require('./dashboard');
const SequenceLoader = require('haste-plugin-loader/src/sequence-logger/sequence-loader');

module.exports = class DashboardPlugin {
  constructor({ oneLinerTasks = true, frameRate = 60, tasks = [] } = {}) {
    this.oneLinerTasks = oneLinerTasks;
    this.frameRate = frameRate;
    this.tasks = tasks;
  }

  apply(runner) {
    const dashboard = new Dashboard({
      tasks: this.tasks,
      maxPanels: 4
    });

    runner.plugin('start-worker', (worker) => {
      const log = dashboard.getLogger(worker.name);
      worker.child.stdout.setEncoding('utf8');
      worker.child.stderr.setEncoding('utf8');

      ['stdout', 'stderr'].forEach(std =>
        worker.child[std].on('data', log)
      );
    });

    const loader = new SequenceLoader({
      oneLinerTasks: this.oneLinerTasks,
      frameRate: this.frameRate
    });

    runner.plugin('start', () => {
      loader.render();
    });

    runner.plugin('start-run', (runPhase) => {
      const runTitle = runPhase.tasks.map(task => task.name).join(',');
      const tasksLength = runPhase.tasks.length;
      const loaderRun = loader.startRun(runTitle, tasksLength);

      runPhase.tasks.forEach((task) => {
        let loaderTask;

        task.plugin('start-task', () => {
          loaderTask = loaderRun.startTask(task.name);
        });

        task.plugin('succeed-task', () => {
          loaderTask.success(task.name);
        });

        task.plugin('failed-task', () => {
          loaderTask.failure(task.name);
        });
      });

      runPhase.plugin('succeed-run', () => {
        loaderRun.success();
      });

      runPhase.plugin('failed-run', (error) => {
        loaderRun.failure(error);
      });
    });

    runner.plugin('finish-success', () => {
      if (!runner.persistent) {
        return loader.done();
      }

      loader.exitAndClear();
      return dashboard.render();
    });

    runner.plugin('finish-failure', (error) => {
      loader.exitOnError(error);
    });
  }
};
