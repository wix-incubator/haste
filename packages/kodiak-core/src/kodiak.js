const path = require('path');
const cp = require('child_process');
const chalk = require('chalk');
const { format, delta } = require('./utils');

const worker = path.resolve(__dirname, 'worker');

module.exports.run = (task) => {
  const child = cp.fork(worker, [task], {});

  const start = new Date();
  const taskname = path.basename(task);

  console.log(`[${format(start)}] ${chalk.black.bgGreen('Starting')} '${taskname}'...`);

  const result = new Promise((resolve, reject) =>
    child.on('close', code => code === 0 ? resolve() : reject())
  );

  return result
    .then(() => {
      const [end, time] = delta(start);
      console.log(`[${format(end)}] ${chalk.black.bgCyan('Finished')} '${taskname}' after ${time} ms`);
    })
    .catch(() => {
      console.log('123');
      const [end, time] = delta(start);
      console.log(`[${format(end)}] ${chalk.white.bgRed('Failed')} '${taskname}' after ${time} ms`);
    });
};
