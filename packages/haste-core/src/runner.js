const { fork } = require('child_process');
const Tapable = require('tapable');
const chokidar = require('chokidar');
const { resolveTaskName } = require('./utils');
const Task = require('./task');
const Worker = require('./worker');
const RunPhase = require('./run-phase');

const WORKER_BIN = require.resolve('./worker-bin');
const WORKER_OPTIONS = { silent: true, env: { FORCE_COLOR: true } };

module.exports = class Runner extends Tapable {
  constructor(context) {
    super();
    this.context = context;
    this.workers = {};
  }

  resolveWorker(name) {
    const modulePath = resolveTaskName(name, this.context);

    if (this.workers[modulePath]) {
      return this.workers[modulePath];
    }

    const child = fork(WORKER_BIN, [modulePath], WORKER_OPTIONS);
    const worker = new Worker({ child, modulePath, name });

    this.applyPlugins('start-worker', worker);

    this.workers[modulePath] = worker;

    return worker;
  }

  run(...taskDefs) {
    const tasks = taskDefs
      .map(([name, options]) => {
        const worker = this.resolveWorker(name);
        const task = new Task({ options, worker });

        return task;
      });

    const runPhase = new RunPhase({ tasks });

    this.applyPlugins('start-run', runPhase);

    return runPhase.run()
      .then((results) => {
        runPhase.applyPlugins('succeed-run', results);
        return results;
      }).catch((error) => {
        runPhase.applyPlugins('failed-run', error);
        throw error;
      });
  }

  watch(pattern, callback) {
    return chokidar.watch(pattern, { ignoreInitial: true, cwd: process.cwd() })
      .on('all', (event, path) => callback(path));
  }
};
