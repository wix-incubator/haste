const Kodiak = require('kodiak-core');

const runTasks = (runner, context) => (promise, tasks) => promise.then((previous) => {
  const promises = tasks
    .map(({ task, options }) => runner.run(task, options, context))
    .map(task => task.catch(e => e));

  return Promise.all(promises)
    .then(errors => [...errors, ...previous]);
});

const runCommand = (runner, command, context) =>
  command.reduce(runTasks(runner, context), Promise.resolve([]));

module.exports = (command, plugins, context) => {
  const runner = Kodiak();

  runner.apply(...plugins);

  return runCommand(runner, command, context)
    .then((errors) => {
      if (errors.length) {
        errors.filter(Boolean).map(console.error);
        process.exit(1);
      }

      process.exit(0);
    });
};
