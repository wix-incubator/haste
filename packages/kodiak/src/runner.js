const { fork } = require('child_process');
const Tapable = require('tapable');
const { flatten, resolveTaskName } = require('./utils');
const Task = require('./task');

const WORKER_BIN = require.resolve('./worker');
const WORKER_OPTIONS = { silent: true, env: { FORCE_COLOR: true } };

function forkTask({ module, options }) {
  const child = fork(WORKER_BIN, [], WORKER_OPTIONS);

  process.on('exit', () => child.kill('SIGINT'));
  child.send({ type: 'init', module, options });

  return child;
}

function extractErrors(events) {
  return events
    .filter(event => event.type === 'error')
    .map(event => event.err);
}

async function resolve(taskList, name) {
  const events = await Promise.all(taskList.map(task => task[name]));
  const errors = extractErrors(events);

  return errors;
}

module.exports = class Runner extends Tapable {
  constructor({ context, title }) {
    super();

    this.context = context;
    this.title = title;
  }

  async run(sequence) {
    this.applyPlugins('start', sequence, this.title);

    const digested = await this.digestSequence(sequence);

    const taskList = flatten(digested);

    const completedErrors = await resolve(taskList, 'complete');

    completedErrors.length ?
      this.applyPlugins('finish-with-errors', completedErrors) :
      this.applyPlugins('finish-without-errors');

    this.applyPlugins('finish', digested);

    const endedErrors = await resolve(taskList, 'end');

    if (endedErrors.length) {
      throw endedErrors;
    }
  }

  digestSequence(sequence) {
    return sequence.reduce(async (promise, parallel) => {
      const previousList = await promise;
      const taskList = parallel.map(options => this.runTask(options));

      const errors = await resolve(taskList, 'complete');

      if (errors.length) {
        throw errors;
      }

      return [...previousList, taskList];
    }, Promise.resolve([]));
  }

  runTask({ name, options }) {
    const modulePath = resolveTaskName(name, this.context);

    const child = forkTask({ module: modulePath, options });
    const task = new Task({ module: modulePath, options, child });

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
