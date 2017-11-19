const { Linter, Configuration } = require('tslint');

function runLinter(options, configurationFilePath, files) {
  const linter = new Linter(options);

  files.forEach(({ filename, content }) => {
    const config = Configuration.findConfiguration(configurationFilePath, filename).results;
    linter.lint(filename, content, config);
  });

  return linter.getResult();
}

module.exports = ({ options = { formatter: 'prose' }, configurationFilePath = null } = {}) => (files) => {
  try {
    const { errorCount, output } = runLinter(options, configurationFilePath, files);

    return errorCount > 0 ?
      Promise.reject(output) :
      Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
