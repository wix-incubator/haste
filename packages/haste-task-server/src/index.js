const { spawn } = require('child_process');

let server;

module.exports = ({ serverPath }) => async () => {
  if (server) {
    server.kill('SIGKILL');
  }

  server = spawn(process.execPath, [serverPath], {
    env: Object.assign({ NODE_ENV: 'development' }, process.env),
    stdio: 'inherit'
  });
};

process.on('SIGKILL', () => {
  if (server) {
    server.kill('SIGKILL');
  }
});
