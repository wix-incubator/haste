const cosmiconfig = require('cosmiconfig');
const Kodiak = require('kodiak-core');

const explorer = cosmiconfig('kodiak');

module.exports = (args) => {
  const api = Kodiak();

  function runTasks(promise, tasks) {
    const promises = tasks
      .map(task => api.run(task))
      .map(task => task.catch(e => e));

    return promise.then(() => Promise.all(promises));
  }

  function runCommand(command) {
    return command.reduce(runTasks, Promise.resolve());
  }

  return explorer.load(process.cwd())
    .then(({ config }) => require(config.preset))
    .then(preset => preset(args))
    .then(({ build }) => runCommand(build))
    .then((errors) => {
      if (errors.length) {
        errors.filter(Boolean).map(console.error);
        process.exit(1);
      }
      process.exit(0);
    });
};
