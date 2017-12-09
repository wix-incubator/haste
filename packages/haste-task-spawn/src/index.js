const { spawn } = require('child_process');

let server;

module.exports = async ({ serverPath, stdio = 'inherit' }) => {
  const env = Object.assign({ NODE_ENV: 'development' }, process.env);

  server = spawn(process.execPath, [serverPath], { env, stdio });

  return {
    restart: async () => {
      if (server) {
        server.kill('SIGTERM');
      }

      server = spawn(process.execPath, [serverPath], { env, stdio });
    },
  };
};

process.on('SIGTERM', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});
