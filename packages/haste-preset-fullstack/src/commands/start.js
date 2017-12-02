const DashboardPlugin = require('haste-plugin-dashboard');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, watch, tasks } = configure({
    persistent: true,
    plugins: [
      new DashboardPlugin({
        oneLinerTasks: true,
        tasks: ['babel', 'sass', 'server', 'webpack-dev-server'],
      }),
    ],
  });

  const { clean, read, write, babel, sass, webpackDevServer, server } = tasks;

  await clean({ pattern: `${paths.build}/*` });

  await Promise.all([
    run(
      read({ pattern: `${paths.assets}/**/*.*` }),
      write({ target: paths.build }),
    ),
    run(
      read({ pattern: `${paths.src}/**/*.js` }),
      babel(),
      write({ target: paths.build }),
    ),
    run(
      read({ pattern: `${paths.src}/**/*.scss` }),
      sass(),
      write({ target: paths.build }),
    ),
    run(webpackDevServer({ configPath: paths.config.webpack.development })),
  ]);

  await run(server({ serverPath: 'src/server.js' }));

  watch(`${paths.src}/**/*.js`, changed => run(
    read({ pattern: changed }),
    babel(),
    write({ target: paths.build }),
    server({ serverPath: 'dist/src/server.js' }),
  ));

  watch(`${paths.src}/**/*.scss`, changed => run(
    read({ pattern: changed }),
    sass(),
    write({ target: paths.build }),
  ));

  watch(paths.assets, changed => run(
    read({ pattern: changed }),
    write({ target: paths.build }),
  ));
};
