const { fork } = require('child_process');
const uuid = require('uuid/v1');
const Tapable = require('tapable');
const chokidar = require('chokidar');
const { resolveTaskName } = require('./utils');
const Task = require('./task');
const RunPhase = require('./run-phase');

const WORKER_BIN = require.resolve('./worker');
const WORKER_OPTIONS = { silent: true, env: { FORCE_COLOR: true } };

const sleep = time => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, time);
});
module.exports = class Runner extends Tapable {
  constructor(context) {
    super();
    this.context = context;
  }

  define(name) {
    const modulePath = resolveTaskName(name, this.context);
    const child = fork(WORKER_BIN, [modulePath], WORKER_OPTIONS);
    const rawTask = { child, name, modulePath };

    return (options) => {
      const run = async (input, task) => {
        task.applyPlugins('start-task', options);

        await sleep(1000); // use this so the loader will work with more realistic timings

        const callId = uuid();

        task.child.send({ options, input, id: callId });

        const promise = new Promise((resolve, reject) =>
          task.child.on('message', ({ result, error, id }) => {
            if (id === callId) {
              error ? reject(error) : resolve(result);
            }
          })
        );

        promise
          .then(result => task.applyPlugins('succeed-task', result))
          .catch(error => task.applyPlugins('failed-task', error));

        return promise;
      };

      return ({ f: run, rawTask });
    };
  }

  run(...tasks) {
    const tapableTasks = tasks.map(t => new Task(t.rawTask));
    const runPhase = new RunPhase(tapableTasks);
    this.applyPlugins('start-run', (runPhase));

    return tasks.reduce((promise, task, i) => {
      return promise.then((input) => {
        return task.f(input, tapableTasks[i]);
      });
    }, Promise.resolve())
      .then((results) => {
        runPhase.applyPlugins('succeed-run', (results));
        return results;
      }).catch((err) => {
        runPhase.applyPlugins('failed-run', (err));
        throw err;
      });
  }

  watch(pattern, callback) {
    return chokidar.watch(pattern, { ignoreInitial: true, cwd: process.cwd() })
      .on('all', (event, path) => callback(path));
  }
};
