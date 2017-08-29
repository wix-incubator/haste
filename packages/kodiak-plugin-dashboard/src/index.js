const path = require('path');
const chalk = require('chalk');
const { format, delta } = require('./utils');
const { flatten, prop } = require('ramda');

module.exports = class DashboardPlugin {
  apply(runner) {
    const Dashboard = require('./dashboard');
    const dashboard = new Dashboard();

    runner.plugin('start', (tasks) => {
      const taskList = flatten(tasks).map(prop('task'));
      dashboard.init({ tasks: taskList, maxPanels: 4 });
    });

    runner.plugin('start-task', (task) => {
      const log = dashboard.getLogger(task.module);
      task.child.stdout.setEncoding('utf8');

      ['stdout', 'stderr'].forEach(name => task.child[name].on('data', (data) => {
        log(data);
      }));

      const start = new Date();
      log(`[${format(start)}] ${chalk.black.bgGreen('Starting')} '${path.basename(task.module)}'...`);

      task.plugin('succeed-task', () => {
        const [end, time] = delta(start);
        log(`[${format(end)}] ${chalk.black.bgCyan('Finished')} '${path.basename(task.module)}' after ${time} ms`);
      });

      task.plugin('failed-task', () => {
        const [end, time] = delta(start);
        log(`[${format(end)}] ${chalk.white.bgRed('Failed')} '${path.basename(task.module)}' after ${time} ms`);
      });
    });
  }
};
