const { fork } = require('child_process');

const WORKER_BIN = require.resolve('./worker-bin');
const WORKER_OPTIONS = { silent: true, env: Object.assign({ FORCE_COLOR: true }, process.env) };

module.exports.run = (modulePath) => {
  const workers = {};

  const command = (options) => {
    let stdout = '';

    const child = fork(WORKER_BIN, [modulePath], WORKER_OPTIONS);

    workers[child.pid] = child;

    const promise = new Promise((resolve, reject) => {
      child.on('message', ({ result, error }) => {
        error ? reject(error) : resolve(result);
      });
    });

    child.stdout.on('data', (buffer) => {
      console.log(buffer.toString());
      stdout += buffer.toString();
    });

    child.stderr.on('data', (buffer) => {
      console.log(buffer.toString());
      // stdout += buffer.toString();
    });

    process.on('SIGTERM', () => child.kill('SIGTERM'));

    return {
      stdout: () => stdout,
      task: (input) => {
        child.send({ options, input });
        return promise;
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
