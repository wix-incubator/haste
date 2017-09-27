const LoggerPlugin = require('kodiak-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure, { watch }) => {
  const { define } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const jest = define({ name: 'jest' });

  await jest({ pattern: paths.test, watch });

  return {
    persistent: watch,
  };
};

