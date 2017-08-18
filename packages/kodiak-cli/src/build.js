const cosmiconfig = require('cosmiconfig');
const { run } = require('kodiak-core');

const explorer = cosmiconfig('kodiak');

function runTasks(promise, tasks) {
  return promise.then(() => Promise.all(tasks.map(run)));
}

function runCommand(command) {
  return command.reduce(runTasks, Promise.resolve());
}

module.exports = args => explorer.load(process.cwd())
  .then(({ config }) => require(config.preset))
  .then(preset => preset(args))
  .then(({ build }) => runCommand(build))
  .then(() => console.log('done!'));
