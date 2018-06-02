const chalk = require('chalk');

const typescriptCompletionRegex = /Watching for file changes/;
const typescriptCompletionErrorRegex = /Found [1-9]+/;
const typescriptErrorRegex = /error TS\d+:/;

module.exports.hasCompletionMessage = lines =>
  lines.some(line => typescriptCompletionRegex.test(line));

module.exports.colorPrint = (line) => {
  if (typescriptErrorRegex.test(line) || typescriptCompletionErrorRegex.test(line)) {
    return console.error(chalk.red(line));
  }

  if (typescriptCompletionRegex.test(line)) {
    return console.log(chalk.green(line));
  }

  return console.log(line);
};

