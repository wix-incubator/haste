const { runCLI } = require('jest-cli');

module.exports = ({ argv, projects = [process.cwd()] }) => () => {
  const result = runCLI(argv, projects)
    .then(({ results }) => {
      if (!results.success) {
        return Promise.reject(results);
      }

      return results;
    });

  if (argv.watch || argv.watchAll) {
    return Promise.resolve();
  }

  return result;
};
