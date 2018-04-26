const { Linter, Configuration } = require('tslint');

function runLinter({ options, tslintFilePath, tsconfigFilePath, files }) {
  let linter;

  if (tsconfigFilePath) {
    const program = Linter.createProgram(tsconfigFilePath);
    linter = new Linter(options, program);

    Linter.getFileNames(program).forEach((file) => {
      const fileContents = program.getSourceFile(file).getFullText();
      const configuration = Configuration.findConfiguration(tslintFilePath, file).results;
      linter.lint(file, fileContents, configuration);
    });
  } else {
    linter = new Linter(options);

    files.forEach(({ filename, content }) => {
      const configuration = Configuration.findConfiguration(tslintFilePath, filename).results;
      linter.lint(filename, content, configuration);
    });
  }

  return linter.getResult();
}

module.exports = async ({
  pattern = '',
  tsconfigFilePath = '',
  tslintFilePath = '',
  options = { formatter: 'prose' },
} = {}, { fs }) => {
  if (!pattern && !tsconfigFilePath) {
    throw new Error('haste-task-tslint requires a pattern or a tsconfigFilePath');
  }

  const files = await fs.read({ pattern });
  const { errorCount, output } = runLinter({ options, tslintFilePath, tsconfigFilePath, files });

  if (errorCount > 0) {
    throw output;
  }
};
