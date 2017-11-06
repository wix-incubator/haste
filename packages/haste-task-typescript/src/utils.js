const chalk = require('chalk');

const typescriptCompletionRegex = /Compilation complete/;
const typescriptErrorRegex = /error TS\d+:/;

module.exports.hasCompletionMessage = lines =>
  lines.some(line => typescriptCompletionRegex.test(line));

module.exports.hasErrorMessage = lines =>
  lines.some(line => typescriptErrorRegex.test(line));

module.exports.colorPrint = (line) => {
  if (typescriptErrorRegex.test(line)) {
    return console.error(chalk.red(line));
  }

  if (typescriptCompletionRegex.test(line)) {
    return console.log(chalk.green(line));
  }

  return console.log(line);
};

