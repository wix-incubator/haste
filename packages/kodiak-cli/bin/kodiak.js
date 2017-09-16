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
    const preset = require(presetPath);
    const { commands, plugins } = preset(argv, config);

    const options = {
      title: cmd,
      context: presetPath,
      plugins,
    };

    const runner = kodiak(options);

    runner.run(commands[cmd])
      .then(() => {
        process.exit(0);
      })
      .catch((errors) => {
        if (errors.length) {
          errors.filter(Boolean).map(console.error);
          process.exit(1);
        }
      });
  });
