const { runCLI } = require('jest-cli');

module.exports = ({ config, projects = [process.cwd()] }) => () => {
  const argv = {
    config: JSON.stringify(config),
  };

  return runCLI(argv, projects)
    .then(({ results }) => {
      if (!results.success) {
        return Promise.reject(results);
      }

      return results;
    });
};
