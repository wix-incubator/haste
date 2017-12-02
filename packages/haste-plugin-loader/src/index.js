const SequenceLoader = require('./sequence-logger/sequence-loader');
const { generateRunTitle } = require('./utils');

module.exports = class LoaderPlugin {
  constructor({ oneLinerTasks = true, frameRate = 60 } = {}) {
    this.oneLinerTasks = oneLinerTasks;
    this.frameRate = frameRate;
  }

  apply(runner) {
    const loader = new SequenceLoader({
      oneLinerTasks: this.oneLinerTasks,
      frameRate: this.frameRate,
    });

    runner.hooks.beforeExecution.tap('connect loader', (execution) => {
      loader.render();

      execution.hooks.createTask.tap('connect task loader', (task) => {
        task.hooks.before.tap('task loader start', (run) => {
          const taskLoader = loader.startTask(task.name);

          run.hooks.success.tap(' ', () => {
            taskLoader.success();
          });

          run.hooks.failure.tap(' ', (error) => {
            taskLoader.failure(error);
          });
        });
      });

      execution.hooks.success.tap('finish-success', () => {
        if (!execution.persistent) {
          return loader.done();
        }

        return loader.watchMode();
      });

      execution.hooks.failure.tap('finish-failure', (error) => {
        loader.exitOnError(error);
      });
    });

  //   runner.plugin('start', () => {
  //     loader.render();
  //   });

  //   runner.plugin('start-run', (runPhase) => {
  //     const runTitle = generateRunTitle(runPhase.tasks);
  //     const tasksLength = runPhase.tasks.length;
  //     const loaderRun = loader.startRun(runTitle, tasksLength);

  //     runPhase.tasks.forEach((task) => {
  //       let loaderTask;

  //       task.plugin('start-task', () => {
  //         loaderTask = loaderRun.startTask(task.name);
  //       });

  //       task.plugin('succeed-task', () => {
  //         loaderTask.success(task.name);
  //       });

  //       task.plugin('failed-task', () => {
  //         loaderTask.failure(task.name);
  //       });
  //     });

  //     runPhase.plugin('succeed-run', () => {
  //       loaderRun.success();
  //     });

  //     runPhase.plugin('failed-run', (error) => {
  //       loaderRun.failure(error);
  //     });
  //   });

  //   runner.plugin('finish-success', () => {
  //     if (!runner.persistent) {
  //       return loader.done();
  //     }

  //     return loader.watchMode();
  //   });

  //   runner.plugin('finish-failure', (error) => {
  //     loader.exitOnError(error);
  //   });
  }
};
