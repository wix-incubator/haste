const { flatten, prop } = require('ramda');
const Dashboard = require('./dashboard');

module.exports = class DashboardPlugin {
  apply(runner) {
    const dashboard = new Dashboard();

    runner.plugin('start', (tasks, cmd) => {
      const taskList = flatten(tasks).map(prop('module'));
      dashboard.init({ tasks: taskList, maxPanels: 4, cmd });
    });

    runner.plugin('start-task', (task) => {
      const log = dashboard.getLogger(task.module);
      task.child.stdout.setEncoding('utf8');

      ['stdout', 'stderr'].forEach(name => task.child[name].on('data', log));
    });
  }
};
