const { Linter, Configuration } = require('tslint');

function runLinter(options, tslintFilePath, tsconfigFilePath) {
  const program = Linter.createProgram(tsconfigFilePath);
  const linter = new Linter(options, program);
  const files = Linter.getFileNames(program);

  files.forEach((file) => {
    const fileContents = program.getSourceFile(file).getFullText();
    const configuration = Configuration.findConfiguration(tslintFilePath, file).results;
    linter.lint(file, fileContents, configuration);
  });

  return linter.getResult();
}

module.exports = async ({
  tsconfigFilePath = '',
  tslintFilePath = '',
  options = { formatter: 'prose' },
} = {}) => {
  const { errorCount, output } = runLinter(options, tslintFilePath, tsconfigFilePath);

  if (errorCount > 0) {
    throw output;
  }
};
