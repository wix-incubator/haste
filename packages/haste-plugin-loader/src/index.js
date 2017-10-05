const SequenceLoader = require('./sequence-logger/sequence-loader');

module.exports = class LoaderPlugin {
  constructor({ oneLinerTasks = true, frameRate = 60 } = {}) {
    this.oneLinerTasks = oneLinerTasks;
    this.frameRate = frameRate;
  }

  apply(runner) {
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

      return loader.watchMode();
    });

    runner.plugin('finish-failure', () => {
      loader.exitOnError();
    });
  }
};
