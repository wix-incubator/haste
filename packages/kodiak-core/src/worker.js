const path = require('path');
const chalk = require('chalk');
const { format, delta } = require('./utils');

function handle(data) {
  const start = new Date();
  const taskname = path.basename(data.task);

  console.log(`[${format(start)}] ${chalk.black.bgGreen('Starting')} '${taskname}'...`);

  const task = require(data.task);

  return task()
    .then(() => {
      const [end, time] = delta(start);
      console.log(`[${format(end)}] ${chalk.black.bgCyan('Finished')} '${taskname}' after ${time} ms`);
    })
    .catch((error) => {
      const [end, time] = delta(start);
      console.log(`[${format(end)}] ${chalk.white.bgRed('Failed')} '${taskname}' after ${time} ms`);

      throw error;
    });
}

module.exports = (data, callback) => handle(data)
  .then(() => callback())
  .catch(callback);
