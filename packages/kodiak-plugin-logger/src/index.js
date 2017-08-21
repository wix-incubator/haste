const path = require('path');
const chalk = require('chalk');
const { format, delta } = require('./utils');

module.exports = class LoggerPlugin {
  apply(runner) {
    runner.plugin('start-task', (task) => {
      const start = new Date();
      console.log(`[${format(start)}] ${chalk.black.bgGreen('Starting')} '${path.basename(task.module)}'...`);

      task.plugin('succeed-task', () => {
        const [end, time] = delta(start);
        console.log(`[${format(end)}] ${chalk.black.bgCyan('Finished')} '${path.basename(task.module)}' after ${time} ms`);
      });

      task.plugin('failed-task', () => {
        const [end, time] = delta(start);
        console.log(`[${format(end)}] ${chalk.white.bgRed('Failed')} '${path.basename(task.module)}' after ${time} ms`);
      });
    });
  }
};
