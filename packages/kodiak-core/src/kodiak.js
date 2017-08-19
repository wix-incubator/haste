const workerFarm = require('worker-farm');

const WORKER_BIN = require.resolve('./worker');

module.exports = () => {
  const workers = workerFarm(WORKER_BIN);

  const api = {
    run: task => new Promise((resolve, reject) =>
      workers({ task }, err => err ? reject(err) : resolve())
    )
  };

  return api;
};
