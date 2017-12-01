const { Linter, Configuration } = require('tslint');

function runLinter(options, configurationFilePath, files) {
  const linter = new Linter(options);

  files.forEach(({ filename, content }) => {
    const config = Configuration.findConfiguration(configurationFilePath, filename).results;
    linter.lint(filename, content, config);
  });

  return linter.getResult();
}

module.exports = async ({
  pattern,
  options = { formatter: 'prose' },
  configurationFilePath = null,
} = {}, { fs }) => {
  const files = await fs.read({ pattern });
  const { errorCount, output } = runLinter(options, configurationFilePath, files);

  if (errorCount > 0) {
    throw output;
  }
};
