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

  await run({ task: 'clean', options: { pattern: `${paths.build}/*` } });

  await Promise.all([
    run(
      { task: 'read', options: { pattern: `${paths.assets}/**/*.*` } },
      { task: 'write', options: { target: paths.build } }
    ),
    run(
      { task: 'read', options: { pattern: `${paths.src}/**/*.js` } },
      { task: 'babel' },
      { task: 'write', options: { target: paths.build } }
    ),
    run(
      { task: 'read', options: { pattern: `${paths.src}/**/*.scss` } },
      { task: 'sass' },
      { task: 'write', options: { target: paths.build } }
    ),
    run({ task: 'webpack-dev-server', options: { configPath: paths.config.webpack.development } }),
  ]);

  await run({ task: 'server', options: { serverPath: 'src/server.js' } });

  watch(`${paths.src}/**/*.js`, changed => run(
    { task: 'read', options: { pattern: changed } },
    { task: 'babel' },
    { task: 'write', options: { target: paths.build } },
    { task: 'server', options: { serverPath: 'dist/src/server.js' } }
  ));

  watch(`${paths.src}/**/*.scss`, changed => run(
    { task: 'read', options: { pattern: changed } },
    { task: 'sass' },
    { task: 'write', options: { target: paths.build } }
  ));

  watch(paths.assets, changed => run(
    { task: 'read', options: { pattern: changed } },
    { task: 'write', options: { target: paths.build } }
  ));
};
