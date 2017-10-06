const DashboardPlugin = require('haste-plugin-dashboard');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, watch } = configure({
    persistent: true,
    plugins: [
      new DashboardPlugin({
        oneLinerTasks: true,
        tasks: ['babel', 'sass', 'server', 'webpack-dev-server']
      }),
    ],
  });

  await run({ name: 'clean', options: { pattern: `${paths.build}/*` } });

  await Promise.all([
    run(
      { name: 'read', options: { pattern: `${paths.assets}/**/*.*` } },
      { name: 'write', options: { target: paths.build } }
    ),
    run(
      { name: 'read', options: { pattern: `${paths.src}/**/*.js` } },
      { name: 'babel' },
      { name: 'write', options: { target: paths.build } }
    ),
    run(
      { name: 'read', options: { pattern: `${paths.src}/**/*.scss` } },
      { name: 'sass' },
      { name: 'write', options: { target: paths.build } }
    ),
    run({ name: 'webpack-dev-server', options: { configPath: paths.config.webpack.development } }),
  ]);

  await run({ name: 'server', options: { serverPath: 'src/server.js' } });

  watch(`${paths.src}/**/*.js`, changed => run(
    { name: 'read', options: { pattern: changed } },
    { name: 'babel' },
    { name: 'write', options: { target: paths.build } },
    { name: 'server', options: { serverPath: 'dist/src/server.js' } }
  ));

  watch(`${paths.src}/**/*.scss`, changed => run(
    { name: 'read', options: { pattern: changed } },
    { name: 'sass' },
    { name: 'write', options: { target: paths.build } }
  ));

  watch(paths.assets, changed => run(
    { name: 'read', options: { pattern: changed } },
    { name: 'write', options: { target: paths.build } }
  ));
};
