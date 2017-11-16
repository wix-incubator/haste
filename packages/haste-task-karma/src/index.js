const { Server } = require('karma');

module.exports = config => async () => {
  return new Promise((resolve, reject) => {
    const server = new Server(config, (exitCode) => {
      if (exitCode === 0) {
        resolve();
      } else {
        reject();
      }

      process.exit(exitCode);
    });

    server.on('run_complete', (result) => {
      const { exitCode } = result.getResults();

      if (exitCode === 0) {
        return resolve();
      }

      return reject();
    });

    server.start();
  });
};
