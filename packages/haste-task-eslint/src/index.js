const { CLIEngine } = require('eslint');

module.exports = options => files => new Promise((resolve, reject) => {
  const cli = new CLIEngine(options);
  const filePaths = files.map(({ filename }) => filename);
  const report = cli.executeOnFiles(filePaths);
  const formatter = cli.getFormatter();

  const errors = CLIEngine.getErrorResults(report.results);

  if (errors.length) {
    console.log(formatter(report.results));
    return reject(formatter(report.results));
  }

  return resolve();
});
