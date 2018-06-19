module.exports = async (config) => {
  return new Promise((resolve, reject) => {
    let karmaVersion;
    let Server;

    try {
      Server = require('karma').Server;
      karmaVersion = /^(\d+)/.exec(require('karma/package.json').version).pop();
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        reject(new Error(
          'Running this requires `karma` >=1. Please install it and re-run.',
        ));
      }

      reject(error);
    }

    if (Number(karmaVersion) < 1) {
      reject(new Error(
        `The installed version of \`karma\` is not compatible (expected: >= 1, actual: ${karmaVersion}).`,
      ));
    }

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
