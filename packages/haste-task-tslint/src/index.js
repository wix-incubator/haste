const { Linter, Configuration } = require('tslint');

module.exports = (options = {}) => async (files) => {
  const linter = new Linter(options);

  const results = await Promise.all(
    files
      .map(async ({ filename, content }) => {
        const config = Configuration.findConfiguration(null, filename).results;
        linter.lint(filename, content, config);
        return linter.getResult();
      })
  );

  const errorCount = results.reduce((acc, result) => acc + result.errorCount, 0);

  if (errorCount) {
    const output = results.reduce((acc, result) => acc + result.output, '');
    return Promise.reject(`${output}\n${errorCount} error(s)\n`);
  }

  return Promise.resolve();
};
