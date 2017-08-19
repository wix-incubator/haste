const cosmiconfig = require('cosmiconfig');
const Kodiak = require('kodiak-core');

const explorer = cosmiconfig('kodiak');

module.exports = (argv) => {
  const api = Kodiak();

  function runTasks(promise, tasks) {
    return promise.then(() => {
      const promises = tasks
        .map(({ task, args }) => api.run(task, args))
        .map(task => task.catch(e => e));

      return Promise.all(promises);
    });
  }

  function runCommand(command) {
    return command.reduce(runTasks, Promise.resolve());
  }

  return explorer.load(process.cwd())
    .then(({ config }) => require(config.preset))
    .then(preset => preset(argv))
    .then(({ test }) => runCommand(test))
    .then((errors) => {
      if (errors.length) {
        errors.filter(Boolean).map(console.error);
        process.exit(1);
      }

      process.exit(0);
    });
};
