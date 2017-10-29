const LoaderPlugin = require('haste-plugin-loader');
const StatsPlugin = require('haste-plugin-stats');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, tasks } = configure({
    plugins: [
      new LoaderPlugin({ oneLinerTasks: false }),
      new StatsPlugin()
    ],
  });

  const { clean, read, babel, write, sass, webpack } = tasks;

  await run(clean({ pattern: `${paths.build}/*` }));

  await Promise.all([
    run(
      read({ pattern: `${paths.src}/**/*.js` }),
      babel(),
      write({ target: paths.build })
    ),
    run(
      read({ pattern: `${paths.src}/**/*.scss` }),
      sass(),
      write({ target: paths.build })
    ),
    run(
      read({ pattern: `${paths.assets}/**/*.*` }),
      write({ target: paths.build })
    ),
    run(webpack({ configPath: paths.config.webpack.production }))
  ]);
};
