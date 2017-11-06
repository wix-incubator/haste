const { spawn } = require('child_process');
const dargs = require('dargs');

const typescriptCompletionRegex = /Compilation complete/;
const typescriptErrorRegex = /error TS\d+:/;
const defaultOptions = { project: './' };

module.exports = (options = {}) =>
  async () => {
    const tscBin = require.resolve('typescript/bin/tsc');
    const args = dargs(
      Object.assign(defaultOptions, options),
      { useEquals: false, allowCamelCase: true }
    );

    return new Promise((resolve, reject) => {
      const tscWorker = spawn(tscBin, args);
      process.on('exit', () => tscWorker.kill('SIGTERM'));

      tscWorker.stdout.pipe(process.stdout);

      tscWorker.stdout.on('data', (buffer) => {
        const lines = buffer.toString().split('\n');
        const hasErrors = lines.some(line => typescriptErrorRegex.test(line));
        const hasCompletionMessage = lines.some(line => typescriptCompletionRegex.test(line));

        if (options.watch) {
          if (hasCompletionMessage || hasErrors) {
            resolve();
          }
        }
      });

      tscWorker.on('exit', code => code === 0 ? resolve() : reject());
    });
  };
