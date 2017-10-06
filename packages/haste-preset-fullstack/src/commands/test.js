const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure, { watch: shouldWatch }) => {
  const { run, watch } = configure({
    persistent: shouldWatch,
    plugins: [
      new LoggerPlugin(),
    ],
  });

  await run(
    { task: 'read', options: { pattern: `${paths.test}/**/*.spec.js` } },
    { task: 'mocha' }
  );

  if (shouldWatch) {
    watch([`${paths.src}/**/*.js`, `${paths.test}/**/*.js`], changed => run(
      { task: 'read', options: { pattern: changed } },
      { task: 'mocha' }
    ));
  }
};

