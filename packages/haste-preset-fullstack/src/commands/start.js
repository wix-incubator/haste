const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, watch, define } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const read = define('read');
  const write = define('write');
  const babel = define('babel');
  const clean = define('clean');
  const webpackDevServer = define('webpack-dev-server');

  await run(
    clean(`${paths.build}/*`)
  );

  await Promise.all([
    run(
      read(`${paths.assets}/**/*.*`),
      write(paths.build)
    ),

    run(
      read(`${paths.src}/**/*.js`),
      babel(),
      write(paths.build)
    ),

    run(
      webpackDevServer({ configPath: paths.config.webpack.development })
    ),
  ]);

  watch(paths.src, async (changed) => {
    await run(
      read(changed),
      babel(),
      write(paths.build)
    );
  });

  watch(paths.assets, async (changed) => {
    await run(
      read(changed),
      write(paths.build)
    );
  });

  return {
    persistent: true,
  };
};
