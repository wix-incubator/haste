const LoaderPlugin = require('haste-plugin-loader');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run } = configure({
    plugins: [
      new LoaderPlugin({ oneLinerTasks: false }),
    ],
  });

  await run({ name: 'clean', options: { pattern: `${paths.build}/*` } });

  await Promise.all([
    run(
      { name: 'read', options: { pattern: `${paths.src}/**/*.js` } },
      { name: 'babel' },
      { name: 'write', options: { target: paths.build } }
    ),
    run(
      { name: 'read', options: { pattern: `${paths.assets}/**/*.*` } },
      { name: 'write', options: { target: paths.build } }
    ),
    run({ name: 'webpack', options: { configPath: paths.config.webpack.production } })
  ]);
};
