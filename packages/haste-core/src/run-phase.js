const Tapable = require('tapable');

module.exports = class RunPhase extends Tapable {
  constructor({ tasks }) {
    super();
    this.tasks = tasks;
  }

  run() {
    return this.tasks.reduce(async (promise, task) => {
      const input = await promise;

      task.applyPlugins('start-task', task.options);

      return task.run(input)
        .then((result) => {
          task.applyPlugins('succeed-task', result);
          return result;
        })
        .catch((error) => {
          task.applyPlugins('failed-task', error);
          throw error;
        });
    }, Promise.resolve());
  }
};
