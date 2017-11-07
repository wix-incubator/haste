const { fork } = require('child_process');
const uuid = require('uuid/v4');

const WORKER_BIN = require.resolve('./worker-bin');
const WORKER_OPTIONS = { silent: true, env: Object.assign({ FORCE_COLOR: true }, process.env) };

module.exports.run = (modulePath) => {
  const workers = {};
  const callbacks = {};

  const command = (options) => {
    let stdout = '';
    let stderr = '';

    const child = fork(WORKER_BIN, [modulePath], WORKER_OPTIONS);

    workers[child.pid] = child;

    child.on('message', ({ id, result, error, type }) => {
      type === 'failure' ?
        callbacks[id].reject(error) :
        callbacks[id].resolve(result);
    });

    child.stdout.on('data', (buffer) => {
      stdout += buffer.toString();
    });

    child.stderr.on('data', (buffer) => {
      stderr += buffer.toString();
    });

    process.on('SIGTERM', () => child.kill('SIGTERM'));

    return {
      stdout: () => stdout,
      stderr: () => stderr,
      task: (input) => {
        return new Promise((resolve, reject) => {
          const id = uuid();
          callbacks[id] = { resolve, reject };
          child.send({ options, input, id });
        });
      },
    };
  };

  const kill = () => {
    Object.keys(workers)
      .forEach((key) => {
        workers[key].kill();
        delete workers[key];
      });
  };

  return { command, kill };
};
