// const LoggerPlugin = require('haste-plugin-logger');
const LoaderPlugin = require('haste-plugin-loader');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run } = configure({
    plugins: [
      new LoaderPlugin({ oneLinerTasks: false }),
      // new LoggerPlugin(),
    ],
  });

  await run(['clean', `${paths.build}/*`]);

  await Promise.all([
    run(
      ['read', `${paths.src}/**/*.js`],
      ['babel'],
      ['write', paths.build]
    ),
    run(
      ['read', `${paths.assets}/**/*.*`],
      ['write', paths.build]
    ),
    run(['webpack', { configPath: paths.config.webpack.production }])
  ]);
};
