const { fork } = require('child_process');

const WORKER_BIN = require.resolve('./worker-bin');
const WORKER_OPTIONS = { silent: true, env: { FORCE_COLOR: true } };

module.exports = modulePath => options => (input) => {
  let stdout = '';

  const child = fork(WORKER_BIN, [modulePath], WORKER_OPTIONS);
  child.stdout.on('data', buffer => stdout += buffer.toString());

  child.send({ options, input });

  const merge = obj => Object.assign(obj, {
    stdout: () => stdout,
    kill: () => child.kill(),
  });

  const promise = new Promise((resolve, reject) => {
    child.on('message', ({ result, error }) => {
      error ? reject({ error }) : resolve({ result });
    });
  });

  return promise
    .then(result => merge(result))
    .catch((error) => {
      throw merge(error);
    });
};
