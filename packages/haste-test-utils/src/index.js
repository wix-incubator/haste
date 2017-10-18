const { fork } = require('child_process');

const WORKER_BIN = require.resolve('./worker-bin');
const WORKER_OPTIONS = { silent: true, env: Object.assign({ FORCE_COLOR: true }, process.env) };

module.exports.run = modulePath => (options) => {
  let stdout = '';

  const child = fork(WORKER_BIN, [modulePath], WORKER_OPTIONS);

  const promise = new Promise((resolve, reject) => {
    child.on('message', ({ result, error }) => {
      error ? reject(error) : resolve(result);
    });
  });

  child.stdout.on('data', buffer => stdout += buffer.toString());

  process.on('SIGTERM', () => child.kill('SIGTERM'));

  return {
    kill: () => child.kill(),
    stdout: () => stdout,
    task: (input) => {
      child.send({ options, input });
      return promise;
    },
  };
};
