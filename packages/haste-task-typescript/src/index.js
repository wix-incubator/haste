const dargs = require('dargs');
const spawn = require('cross-spawn');
const { hasErrorMessage, hasCompletionMessage, colorPrint } = require('./utils');

const defaultOptions = { project: './' };

module.exports = async (options = {}) => {
  const tscBin = require.resolve('typescript/bin/tsc');
  const optionsWithDefaults = Object.assign(defaultOptions, options);
  const args = dargs(optionsWithDefaults, { useEquals: false, allowCamelCase: true });

  return new Promise((resolve, reject) => {
    const tscWorker = spawn('node', [tscBin, ...args]);

    process.on('exit', () => tscWorker.kill('SIGTERM'));

    tscWorker.stdout.on('data', (buffer) => {
      const lines = buffer.toString().split('\n');

      lines.forEach(colorPrint);

      if (options.watch) {
        if (hasCompletionMessage(lines) || hasErrorMessage(lines)) {
          resolve();
        }
      }
    });

    tscWorker.on('exit', code => code === 0 ?
      resolve() : reject(new Error(`tsc exited with code ${code}`)),
    );
  });
};
