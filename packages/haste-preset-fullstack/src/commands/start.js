const { createRunner } = require('haste-core');
const DashboardPlugin = require('haste-plugin-dashboard');
const paths = require('../../config/paths');

const runner = createRunner({
  plugins: [
    new DashboardPlugin({
      tasks: ['babel', 'sass', 'copy', 'webpackDevServer'],
    }),
  ],
});

module.exports = runner.command(async ({
  clean, copy, babel, sass, webpackDevServer,
}) => {
  await copy({ pattern: `${paths.assets}/**/*.*`, target: paths.build });
  await clean({ pattern: `${paths.build}/*` });

  await Promise.all([
    babel({ pattern: `${paths.src}/**/*.js`, target: paths.build }),
    sass({ pattern: `${paths.src}/**/*.scss`, target: paths.build }),
    webpackDevServer({ configPath: paths.config.webpack.development }),
  ]);

  // spawn server

  runner.watch({ pattern: `${paths.src}/**/*.js` }, async (changed) => {
    await babel({ pattern: changed, target: paths.build });
    // spawn server
  });

  runner.watch({ pattern: `${paths.src}/**/*.scss` }, async (changed) => {
    await sass({ pattern: changed, target: paths.build });
  });

  runner.watch({ pattern: paths.assets }, async (changed) => {
    await copy({ pattern: changed, target: paths.build });
  });
}, { persistent: true });
