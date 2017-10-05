// const LoggerPlugin = require('haste-plugin-logger');
// const LoaderPlugin = require('haste-plugin-loader');
const DashboardPlugin = require('haste-plugin-dashboard');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, watch } = configure({
    persistent: true,
    plugins: [
      new DashboardPlugin({
        oneLinerTasks: true,
        tasks: ['babel', 'server', 'webpack-dev-server']
      }),
    ],
  });

  await run(['clean', `${paths.build}/*`]);

  await Promise.all([
    run(
      ['read', `${paths.assets}/**/*.*`],
      ['write', paths.build]
    ),
    run(
      ['read', `${paths.src}/**/*.js`],
      ['babel'],
      ['write', paths.build]
    ),
    run(['webpack-dev-server', { configPath: paths.config.webpack.development }]),
  ]);

  await run(['server', { serverPath: 'dist/src/server.js' }]);

  watch(paths.src, changed => run(
    ['read', changed],
    ['babel'],
    ['write', paths.build],
    ['server', { serverPath: 'dist/src/server.js' }]
  ));

  watch(paths.assets, changed => run(
    ['read', changed],
    ['write', paths.build]
  ));
};
