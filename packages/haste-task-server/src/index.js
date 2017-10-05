const { spawn } = require('child_process');

let server;

module.exports = ({ serverPath }) => async () => {
  if (server) {
    server.kill('SIGTERM');
  }

  server = spawn(process.execPath, [serverPath], {
    env: Object.assign({ NODE_ENV: 'development' }, process.env),
    stdio: 'inherit'
  });
};

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});

process.on('SIGINT', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});
