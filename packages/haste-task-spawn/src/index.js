const { spawn } = require('child_process');

let server;

module.exports = ({ serverPath }, { worker }) => {
  if (server) {
    server.kill('SIGTERM');
  }

  server = spawn(process.execPath, [serverPath], {
    env: Object.assign({ NODE_ENV: 'development' }, process.env),
    stdio: 'inherit'
  });

  worker.idle();
};

process.on('SIGTERM', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});
