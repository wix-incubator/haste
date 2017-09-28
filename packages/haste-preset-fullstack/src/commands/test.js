const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure, { watch }) => {
  const { run } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  await run('jest', { pattern: paths.test, watch });

  return {
    persistent: watch,
  };
};

