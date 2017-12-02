const { runCLI } = require('jest-cli');

module.exports = async ({ config, projects = [process.cwd()] }) => {
  const argv = {
    config: JSON.stringify(config),
  };

  const { results } = await runCLI(argv, projects);

  if (!results.success) {
    throw new Error(`Jest failed with ${results.numFailedTests} failing tests`);
  }

  return results;
};
