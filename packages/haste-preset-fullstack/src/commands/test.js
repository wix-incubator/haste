const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure, { watch: shouldWatch }) => {
  const { run, define, watch } = configure({
    persistent: shouldWatch,
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const read = define('read');
  const mocha = define('mocha');

  await run(
    read([`${paths.test}/**/*.spec.js`]),
    mocha()
  );

  if (shouldWatch) {
    watch([`${paths.src}/**/*.js`, `${paths.test}/**/*.js`], changed => run(
      read([changed]),
      mocha()
    ));
  }
};

