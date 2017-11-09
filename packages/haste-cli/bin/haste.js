#!/usr/bin/env node

const yargs = require('yargs');
const resolveFrom = require('resolve-from');
const cosmiconfig = require('cosmiconfig');
const haste = require('haste-core');
const get = require('lodash/get');
const { standardizePresetName } = require('../src/utils');

process.on('unhandledRejection', (err) => {
  throw err;
});

const context = process.cwd();

const explorer = cosmiconfig('haste');

const { argv } = yargs
  .command('start', 'Build a project in development mode')
  .command('build', 'Compile the source directory to a bundled build')
  .command('test [files..]', 'Run all suites from the test directory or provided files', {
    watch: {
      description: 'Watch source files for changes and re-run tests',
      boolean: true,
      default: false
    }
  })
  .command('*')
  .option('p', {
    alias: 'preset',
    demandOption: false,
    describe: 'The full name of the preset node module ([haste-preset-name]) or an absolute path to a preset',
    type: 'string'
  })
  .demandCommand(1, 'You must specify a command for Haste to run.\nUSAGE:  haste <command>')
  .version()
  .recommendCommands()
  .help();

const [cmd] = argv._;

explorer.load(context)
  .then((result) => {
    const config = get(result, 'config');
    const presetName = argv.preset || get(config, 'preset');

    if (!presetName) {
      throw new Error('you must pass a preset through cli option \'--preset\', .hasterc, or package.json configs');
    }

    const presetPath = resolveFrom(context, standardizePresetName(presetName));
    const run = haste(presetPath);
    const preset = require(presetPath);
    const command = preset[cmd];

    if (!command) {
      throw new Error(`${presetName} doesn't support command ${cmd}`);
    }

    return run(command, [argv, config])
      .then((runner) => {
        if (!runner.persistent) {
          process.exit(0);
        }
      })
      .catch((error) => {
        if (error.name !== 'WorkerError') {
          console.log(error);
        }

        process.exit(1);
      });
  });
