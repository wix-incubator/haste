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
    { name: 'read', options: { pattern: `${paths.test}/**/*.spec.js` } },
    { name: 'mocha' }
  );

  if (shouldWatch) {
    watch([`${paths.src}/**/*.js`, `${paths.test}/**/*.js`], changed => run(
      { name: 'read', options: { pattern: changed } },
      { name: 'mocha' }
    ));
  }
};

