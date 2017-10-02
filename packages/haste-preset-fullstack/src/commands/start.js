// const LoggerPlugin = require('haste-plugin-logger');
const LoaderPlugin = require('haste-plugin-loader');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, watch, define } = configure({
    plugins: [
      new LoaderPlugin({ oneLinerTasks: true }),
    ],
  });

  const read = define('read');
  const write = define('write');
  const babel = define('babel');
  const clean = define('clean');
  const webpackDevServer = define('webpack-dev-server');
  const server = define('server');

  await run(clean(`${paths.build}/*`));

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
    run(webpackDevServer({ configPath: paths.config.webpack.development })),
  ]);

  await run(server({ serverPath: 'dist/src/server.js' }));

  watch(paths.src, changed => run(
    read(changed),
    babel(),
    write(paths.build),
    server({ serverPath: 'dist/src/server.js' })
  ));

  watch(paths.assets, changed => run(
    read(changed),
    write(paths.build)
  ));

  return {
    persistent: true,
  };
};
