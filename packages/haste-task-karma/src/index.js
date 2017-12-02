const { Server } = require('karma');

module.exports = async (config) => {
  return new Promise((resolve, reject) => {
    const server = new Server(config, (exitCode) => {
      if (exitCode === 0) {
        resolve();
      } else {
        reject(new Error(`Karma failed with code ${exitCode}`));
      }

      process.exit(exitCode);
    });

    server.on('run_complete', (result) => {
      const { exitCode } = result.getResults();

      if (exitCode === 0) {
        return resolve();
      }

      return reject(new Error(`Karma failed with code ${exitCode}`));
    });

    server.start();
  });
};
