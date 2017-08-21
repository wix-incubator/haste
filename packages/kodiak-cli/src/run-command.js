const Kodiak = require('kodiak-core');

const runTasks = api => (promise, tasks) => promise.then((previous) => {
  const promises = tasks
    .map(({ task, options }) => api.run(task, options))
    .map(task => task.catch(e => e));

  return Promise.all(promises)
    .then(errors => [...errors, ...previous]);
});

const runCommand = (api, command) => command.reduce(runTasks(api), Promise.resolve([]));

module.exports = (command, plugins) => {
  const api = Kodiak();

  api.apply(...plugins);

  return runCommand(api, command)
    .then((errors) => {
      if (errors.length) {
        errors.filter(Boolean).map(console.error);
        process.exit(1);
      }

      process.exit(0);
    });
};
