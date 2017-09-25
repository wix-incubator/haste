const Dashboard = require('./dashboard');

module.exports = ({ panels = 4 } = {}) => {
  const dashboard = new Dashboard();
  dashboard.init({ panels });

  return next => (definition) => {
    const run = next(definition);
    const log = dashboard.createPanel({ panelKey: run.child.pid, label: definition.name });

    ['stdout', 'stderr']
      .forEach(name => run.child[name].setEncoding('utf8').on('data', log));

    return (options) => {
      return run(options);
    };
  };
};

// module.exports = class DashboardPlugin {
//   apply(runner) {
//     const dashboard = new Dashboard();

//     runner.plugin('start', (tasks, cmd) => {
//       const taskList = flatten(tasks).map(prop('name'));
//       dashboard.init({ tasks: taskList, maxPanels: 4, cmd });
//     });

//     runner.plugin('start-task', (task) => {
//       const log = dashboard.getLogger(task.name);
//       task.child.stdout.setEncoding('utf8');
//       task.child.stderr.setEncoding('utf8');

//       ['stdout', 'stderr'].forEach(name =>
//         task.child[name].on('data', log)
//       );
//     });
//   }
// };
