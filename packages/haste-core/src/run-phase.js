const Tapable = require('tapable');

module.exports = class RunPhase extends Tapable {
  constructor({ tasks }) {
    super();
    this.tasks = tasks;
  }

  async run() {
    const taskEmitters = [];

    await this.tasks.reduce(async (promise, task) => {
      const formerTaskInput = await promise;

      task.applyPlugins('start-task', task.options);

      return task.run(formerTaskInput)
        .then((taskEmitter) => {
          taskEmitters.push(taskEmitter);

          task.applyPlugins('succeed-task', taskEmitter.value);

          return taskEmitter.value;
        })
        .catch((error) => {
          task.applyPlugins('failed-task', error);

          throw error;
        });
    }, Promise.resolve());

    return taskEmitters;
  }
};
