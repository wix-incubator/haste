const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, define } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const read = define('read');
  const write = define('write');
  const babel = define('babel');
  const clean = define('clean');
  const webpack = define('webpack');

  await run(clean(`${paths.build}/*`));

  await Promise.all([
    run(
      read([`${paths.src}/**/*.js`]),
      babel(),
      write(paths.build)
    ),
    run(
      read([`${paths.assets}/**/*.*`]),
      write(paths.build)
    ),
    run(webpack({ configPath: paths.config.webpack.production }))
  ]);

  return {
    persistent: false,
  };
};
