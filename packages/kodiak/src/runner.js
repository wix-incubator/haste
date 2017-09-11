const { fork } = require('child_process');
const Tapable = require('tapable');
const { flatten } = require('./utils');
const Task = require('./task');

const WORKER_BIN = require.resolve('./worker');
const WORKER_OPTIONS = { silent: true, env: { FORCE_COLOR: true } };

function forkTask({ module, options }) {
  const child = fork(WORKER_BIN, [], WORKER_OPTIONS);

  process.on('exit', () => child.kill('SIGINT'));
  child.send({ type: 'init', module, options });

  return child;
}

module.exports = class Runner extends Tapable {
  async run(sequence, command, mapping) {
    this.applyPlugins('start', sequence, command);

    const digestedSequence = await sequence.reduce((promise, parallel) => {
      return promise.then((previousList) => {
        const taskList = parallel.map(options => this.runTask(options));
        const completed = taskList.map(task => task.complete.catch(e => e));

        return Promise.all(completed)
          .then(() => [...previousList, taskList]);
      });
    }, Promise.resolve([]));

    await mapping(digestedSequence);

    const taskList = flatten(digestedSequence);
    const completed = taskList.map(task => task.complete.catch(e => e));
    const errors = await Promise.all(completed);

    errors.length ?
      this.applyPlugins('finish-with-errors', errors) :
      this.applyPlugins('finish-without-errors');

    const allTasksEnded = taskList.map(task => task.end);

    return Promise.all(allTasksEnded);
  }

  runTask({ module, options }) {
    const child = forkTask({ module, options });
    const task = new Task({ module, options, child });

    this.applyPlugins('start-task', task);

    task.complete
      .then(() => task.applyPlugins('succeed-task'))
      .catch((error) => {
        task.applyPlugins('failed-task');

        throw error;
      });

    return task;
  }
};
