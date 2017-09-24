const { fork } = require('child_process');
const chokidar = require('chokidar');
const { resolveTaskName } = require('./utils');

const WORKER_BIN = require.resolve('./worker');
const WORKER_OPTIONS = { silent: true, env: { FORCE_COLOR: true } };

module.exports = function create(middleware = [], context) {
  function define({ name }) {
    const modulePath = resolveTaskName(name, context);
    const child = fork(WORKER_BIN, [modulePath], WORKER_OPTIONS);

    function run(options) {
      child.send({ options });

      return new Promise((resolve, reject) =>
        child.on('message', ({ result, error }) => error ? reject(error) : resolve(result))
      );
    }

    run.child = child;

    return run;
  }

  function watch(pattern, callback) {
    return chokidar.watch(pattern, { ignoreInitial: true, cwd: process.cwd() })
      .on('all', (event, path) => {
        callback(path);
      });
  }

  const decorated = middleware
    .reduce((prev, next) => next(prev), define);

  return {
    define: decorated,
    watch,
  };
};
