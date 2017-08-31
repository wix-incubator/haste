const { fork } = require('child_process');
const Tapable = require('tapable');
const { flatten } = require('./utils');
const Task = require('./task');

const WORKER_BIN = require.resolve('./worker');
const WORKER_OPTIONS = { silent: true, env: { FORCE_COLOR: true } };

module.exports = class Runner extends Tapable {
  async run(sequence, cmd, mapping) {
    this.applyPlugins('start', sequence, cmd);

    const result = await sequence.reduce((promise, parallel) => {
      return promise.then((list) => {
        const tasks = parallel.map(options => this.runTask(options));
        const results = tasks
          .map(task => task.result)
          .map(result => result.catch(e => e));

        return Promise.all(results)
          .then(() => [...list, tasks]);
      });
    }, Promise.resolve([]));

    await mapping(result);

    const tasks = flatten(result);

    const results = tasks
      .map(task => task.result)
      .map(task => task.catch(e => e));

    const errors = await Promise.all(results);

    errors.length ?
      this.applyPlugins('finish-with-errors', errors) :
      this.applyPlugins('finish-without-errors');

    const done = tasks.map(task => task.done);

    return Promise.all(done);
  }

  fork({ module, options }) {
    const child = fork(WORKER_BIN, [], WORKER_OPTIONS);
    process.on('exit', () => child.kill('SIGINT'));
    child.send({ type: 'init', module, options });

    return child;
  }

  runTask({ module, options }) {
    const child = this.fork({ module, options });
    const task = new Task({ module, options, child });

    this.applyPlugins('start-task', task);

    task.result
      .then(() => task.applyPlugins('succeed-task'))
      .catch((error) => {
        task.applyPlugins('failed-task');

        throw error;
      });

    return task;
  }
};
