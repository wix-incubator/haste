const { spawn } = require('child_process');
// const chalk = require('chalk');

// const typescriptSuccessRegex = /Compilation complete/;
// const typescriptErrorRegex = /error TS\d+:/;

// const noop = () => {};

// function colorTsLogLine(line) {
//   if (typescriptErrorRegex.test(line)) {
//     return chalk.red(line);
//   }

//   if (typescriptSuccessRegex.test(line)) {
//     return chalk.green(line);
//   }

//   return chalk.white(line);
// }

// function print(lines) {
//   return lines.forEach(line => console.log(colorTsLogLine(line)));
// }

// function printErrors(errorLines) {
//   return errorLines.forEach(line => console.log(chalk.red(line)));
// }

// function onStdout(onOutput, onError) {
//   return (buffer) => {
//     const lines = buffer.toString()
//       .split('\n')
//       .filter(a => a.length > 0);

//     const errors = lines.some(line => typescriptErrorRegex.test(line));


//     if (errors) {
//       printErrors(errors);
//       return onError(errors);
//     }

//     print(lines);
//     return onOutput(lines);
//   };
// }

const parseArgs = ({ project, watch }) => ([
  project && '--project',
  project,
  watch && '--watch'
].filter(a => a));

module.exports = ({ watch, project = './', rootDir = './' } = {}) =>
  async () => {
    const tscBin = require.resolve('typescript/bin/tsc');
    const args = parseArgs({ watch, project, rootDir });

    return new Promise((resolve, reject) => {
      const tscWroker = spawn(tscBin, args);
      // tscWroker.stdout.on('data',
      //   onStdout(
      //     content => emit('output', content),
      //     errors => emit('errors', errors),
      //   )
      // );

      // tscWroker.stderr.on('data',
      //   onStdout(
      //     errors => emit('errors', errors),
      //     errors => emit('errors', errors),
      //   )
      // );

      // if (watch) {
      //   resolve();
      // } else {
      //   tscWroker.stdout.on('data', onStdout(noop, reject));
      //   tscWroker.stderr.on('data', onStdout(noop, reject));
      // }
      tscWroker.on('exit', code => code === 0 ? resolve() : reject());
    });
  };
