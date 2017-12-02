const { create } = require('haste-core');
const DashboardPlugin = require('haste-plugin-dashboard');
const paths = require('../../config/paths');

const { define } = create({
  plugins: [
    new DashboardPlugin({
      tasks: ['babel', 'sass', 'copy', 'webpackDevServer'],
    }),
  ],
});

module.exports = define(async ({
  clean, copy, babel, sass, webpackDevServer,
}) => {
  await copy({ pattern: `${paths.assets}/**/*.*`, target: paths.build });
  await clean({ pattern: `${paths.build}/*` });

  await Promise.all([
    babel({ pattern: `${paths.src}/**/*.js`, target: paths.build }),
    sass({ pattern: `${paths.src}/**/*.scss`, target: paths.build }),
    webpackDevServer({ configPath: paths.config.webpack.development }),
  ]);

  // watch(`${paths.src}/**/*.js`, async (changed) => {
  //   await babel({ pattern: changed, target: paths.build });
  //   // spawnserver
  // });

  // watch(`${paths.src}/**/*.scss`, async (changed) => {
  //   await sass({ pattern: changed, target: paths.build });
  // });

  // watch(paths.assets, async (changed) => {
  //   await copy({ pattern: changed, target: paths.build });
  // });
}, { persistent: true });
