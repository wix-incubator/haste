#!/usr/bin/env node

const { cond, equals } = require('ramda');
const yargs = require('yargs');
const test = require('../src/test');

const args = yargs
  .command('test [files..]', 'Run all suites from the test directory or provided files')
  .version()
  .recommendCommands()
  .help()
  .argv;

const [cmd] = args._;

cond([
  [equals('test'), () => test(args)],
  // [T, () => execute(middleware, args)]
])(cmd);
