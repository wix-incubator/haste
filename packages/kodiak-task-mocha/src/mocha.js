const { spawn } = require('child_process');
const { paramCase } = require('change-case');

let proc;

module.exports = (mochaOpts = {}, files = []) => new Promise((resolve, reject) => {
  if (proc) {
    proc.kill();
  }

  const argv = Object
    .keys(mochaOpts)
    .reduce((arg, key) => {
      const value = mochaOpts[key];

      return value === true ?
        [...arg, `--${paramCase(key)}`] :
        [...arg, `--${paramCase(key)}`, value];
    }, []);

  proc = spawn(process.execPath, [require.resolve('mocha/bin/mocha'), ...argv, ...files], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });

  proc.on('close', code => code !== 0 ? reject() : resolve());
});
