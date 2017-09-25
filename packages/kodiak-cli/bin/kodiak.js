#!/usr/bin/env node

const yargs = require('yargs');
const resolveFrom = require('resolve-from');
const cosmiconfig = require('cosmiconfig');
const kodiak = require('kodiak-core');

process.on('unhandledRejection', (err) => {
  throw err;
});

const context = process.cwd();

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

explorer.load(context)
  .then(({ config }) => {
    const presetPath = resolveFrom(context, config.preset);
    const run = kodiak(presetPath);
    const preset = require(presetPath);
    const command = preset[cmd];

    return run(command, [argv, config])
      .then(({ persistent }) => {
        if (!persistent) {
          process.exit(0);
        }
      })
      .catch((error) => {
        console.log(error.stack || error);
        process.exit(1);
      });
  });
