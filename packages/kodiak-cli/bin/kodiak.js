#!/usr/bin/env node

const { cond, equals } = require('ramda');
const yargs = require('yargs');
const test = require('../src/test');

const args = yargs
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
  .help()
  .argv;

const [cmd] = args._;

cond([
  [equals('test'), () => test(args)],
  // [T, () => execute(middleware, args)]
])(cmd);
