const Kodiak = require('kodiak-core');

const runTasks = api => (promise, tasks) => promise.then(() => {
  const promises = tasks
    .map(({ task, args }) => api.run(task, args))
    .map(task => task.catch(e => e));

  return Promise.all(promises);
});

module.exports = (config, command) => {
  const api = Kodiak();

  const runCommand = () => command.reduce(runTasks(api), Promise.resolve());

  return runCommand(command)
    .then((errors) => {
      if (errors.length) {
        errors.filter(Boolean).map(console.error);
        process.exit(1);
      }

      process.exit(0);
    });
};
