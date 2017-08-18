#!/usr/bin/env node

const { cond, equals } = require('ramda');
const yargs = require('yargs');
const build = require('../src/build');

const args = yargs
  .command('build', 'Transpile the source directory')
  .version()
  .recommendCommands()
  .help()
  .argv;

const [cmd] = args._;

cond([
  [equals('build'), () => build(args)],
  // [T, () => execute(middleware, args)]
])(cmd);
