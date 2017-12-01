const fs = require('fs');
const yargs = require('yargs');
const resolveFrom = require('resolve-from');
const get = require('lodash/get');
const { resolvePresetName, loadConfig } = require('../src/utils');

module.exports = async () => {
  const { argv } = yargs
    .option('p', {
      alias: 'preset',
      demandOption: false,
      describe: 'The full name of the preset node module ([haste-preset-name]) or an absolute path to a preset',
      type: 'string'
    })
    .version()
    .help();

  const [command] = argv._;

  if (!command) {
    console.error('You must specify a command for Haste to run');
    process.exit(1);
  }

  const appDirectory = fs.realpathSync(process.cwd());

  const config = loadConfig(appDirectory);
  const presetName = argv.preset || get(config, 'preset');

  if (!presetName) {
    console.error('You must pass a preset through cli option "--preset", .hasterc, or package.json configs');
    process.exit(1);
  }

  const presetPath = resolveFrom.silent(appDirectory, resolvePresetName(presetName));

  if (!presetPath) {
    console.error(`Unable to find "${presetName}", please make sure it is installed`);
    process.exit(1);
  }

  const preset = require(presetPath);
  const action = preset[command];

  if (!action) {
    console.error(`Preset "${presetName}" doesn't support command "${command}"`);
    console.error('');
    console.error('Please try one of the following:');
    Object.keys(preset).forEach(key => console.error(`  - ${key}`));

    process.exit(1);
  }

  try {
    const { persistent = false } = await action({
      context: presetPath,
      workerOptions: { cwd: appDirectory }
    });

    if (!persistent) {
      process.exit(0);
    }
  } catch (error) {
    if (error.name !== 'WorkerError') {
      console.error(error);
    }

    process.exit(1);
  }
};
