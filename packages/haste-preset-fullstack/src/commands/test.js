const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure, { watch: shouldWatch }) => {
  const { run, watch, tasks } = configure({
    persistent: shouldWatch,
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const { read, mocha } = tasks;

  await run(
    read({ pattern: `${paths.test}/**/*.spec.js` }),
    mocha()
  );

  if (shouldWatch) {
    watch([`${paths.src}/**/*.js`, `${paths.test}/**/*.js`], changed => run(
      read({ pattern: changed }),
      mocha()
    ));
  }
};

