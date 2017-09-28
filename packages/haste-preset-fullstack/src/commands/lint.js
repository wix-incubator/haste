const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  await run('eslint', { pattern: paths.javascripts, output: paths.build });

  return {
    persistent: false,
  };
};
