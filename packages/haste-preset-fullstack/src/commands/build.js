const LoaderPlugin = require('haste-plugin-loader');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run } = configure({
    plugins: [
      new LoaderPlugin({ oneLinerTasks: false }),
    ],
  });

  await run({ task: 'clean', options: { pattern: `${paths.build}/*` } });

  await Promise.all([
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
    run(
      { task: 'read', options: { pattern: `${paths.assets}/**/*.*` } },
      { task: 'write', options: { target: paths.build } }
    ),
    run({ task: 'webpack', options: { configPath: paths.config.webpack.production } })
  ]);
};
