#!/usr/bin/env node

const yargs = require('yargs');
const resolveFrom = require('resolve-from');
const cosmiconfig = require('cosmiconfig');
const runCommand = require('../src/run-command');

const explorer = cosmiconfig('kodiak');

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
  .demandCommand(1, 'You must specify a command for Kodiak to run.\nUSAGE:  neutrino <command>')
  .version()
  .recommendCommands()
  .help();

const [cmd] = argv._;

explorer.load(process.cwd())
  .then(({ config }) => {
    const context = resolveFrom(process.cwd(), config.preset);
    const preset = require(context);
    const { commands, plugins } = preset(argv, config);

    return runCommand(commands[cmd], plugins, context);
  });
