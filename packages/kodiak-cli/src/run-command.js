const Kodiak = require('kodiak-core');

const runTasks = runner => (promise, tasks) => promise.then((previous) => {
  const promises = tasks
    .map(({ task, options }) => runner.runTask(task, options))
    .map(task => task.catch(e => e));

  return Promise.all(promises)
    .then(errors => [...errors, ...previous]);
});

const runCommand = (runner, command) =>
  command.reduce(runTasks(runner), Promise.resolve([]));

module.exports = (command, plugins, context) => {
  const runner = Kodiak(context);

  runner.apply(...plugins);

  return runCommand(runner, command)
    .then((errors) => {
      if (errors.length) {
        errors.filter(Boolean).map(console.error);
        process.exit(1);
      }

      process.exit(0);
    });
};
