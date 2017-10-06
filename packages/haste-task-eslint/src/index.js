const { CLIEngine } = require('eslint');

module.exports = ({ options, patterns }) => () => new Promise((resolve, reject) => {
  const cli = new CLIEngine(options);
  const report = cli.executeOnFiles(patterns);
  const formatter = cli.getFormatter();

  console.log(formatter(report.results));

  const errors = CLIEngine.getErrorResults(report.results);

  if (errors.length) {
    return reject();
  }

  return resolve();
});
