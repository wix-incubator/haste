const { Server } = require('karma');

module.exports = config => async () => {
  return new Promise((resolve, reject) => {
    const server = new Server(config, (code) => {
      code === 0 ? resolve() : reject();
    });

    server.start();
  });
};
