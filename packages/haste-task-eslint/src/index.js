const { CLIEngine } = require('eslint');

module.exports = ({ pattern, options = {} }, { fs }) => new Promise(async (resolve, reject) => {
  const files = await fs.read({ pattern });
  const cli = new CLIEngine(options);
  const filePaths = files.map(({ filename }) => filename);
  const report = cli.executeOnFiles(filePaths);

  const formatter = cli.getFormatter(options.formatter);
  options.fix && CLIEngine.outputFixes(report);

  const errors = CLIEngine.getErrorResults(report.results);

  if (errors.length) {
    return reject(formatter(report.results));
  }

  return resolve();
});
