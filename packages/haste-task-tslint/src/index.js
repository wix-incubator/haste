const { Linter, Configuration, findFormatter } = require('tslint');

module.exports = ({ options = {}, configurationFilePath = null } = {}) => async (files) => {
  const linter = new Linter(options);

  const results = await Promise.all(
    files
      .map(async ({ filename, content }) => {
        const config = Configuration.findConfiguration(configurationFilePath, filename).results;
        linter.lint(filename, content, config);
        return linter.getResult();
      })
  );

  const errorCount = results.reduce((acc, result) => acc + result.errorCount, 0);

  if (errorCount) {
    const FormatterConstructor = findFormatter(options.formatter);
    const formatter = new FormatterConstructor();

    const failures = results.reduce((list, result) => list.concat(result.failures), []);

    return Promise.reject(formatter.format(failures));
  }

  return Promise.resolve();
};
