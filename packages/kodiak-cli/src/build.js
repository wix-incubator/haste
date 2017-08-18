const cosmiconfig = require('cosmiconfig');
const Kodiak = require('kodiak-core');

const explorer = cosmiconfig('kodiak');

module.exports = (args) => {
  const kodiak = Kodiak({ size: 3 });

  function runTasks(promise, tasks) {
    return promise.then(() => Promise.all(tasks.map(task => kodiak.run(task))));
  }

  function runCommand(command) {
    return command.reduce(runTasks, Promise.resolve());
  }

  return explorer.load(process.cwd())
    .then(({ config }) => require(config.preset))
    .then(preset => preset(args))
    .then(({ build }) => runCommand(build));
  // .then(() => console.log('done!'));
};
