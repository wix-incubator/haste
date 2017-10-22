#!/usr/bin/env node

const yargs = require('yargs');
const resolveFrom = require('resolve-from');
const cosmiconfig = require('cosmiconfig');
const haste = require('haste-core');

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
  .demandCommand(1, 'You must specify a command for Haste to run.\nUSAGE:  haste <command>')
  .version()
  .recommendCommands()
  .help();

const [cmd] = argv._;

explorer.load(context)
  .then((result) => {
    if (!result) {
      throw new Error('Can\'t find .hasterc or a "haste" field under package.json');
    }

    if (!result.config.preset) {
      throw new Error('"preset" is a mandatory field');
    }

    const presetPath = resolveFrom(context, result.config.preset);
    const run = haste(presetPath);
    const preset = require(presetPath);
    const command = preset[cmd];

    if (!command) {
      throw new Error(`${result.config.preset} doesn't support command ${cmd}`);
    }

    return run(command, [argv, result.config])
      .then(({ persistent }) => {
        if (!persistent) {
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
