const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, define } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const eslint = define('eslint');

  await run(eslint({ pattern: [`${paths.src}/**/*.js`] }));
};
