const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { define } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const eslint = define({ name: 'eslint' });

  await eslint({ pattern: paths.javascripts, output: paths.build });

  return {
    persistent: false,
  };
};
