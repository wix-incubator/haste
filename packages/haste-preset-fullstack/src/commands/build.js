const { createRunner } = require('haste-core');
const LoaderPlugin = require('haste-plugin-loader');
const paths = require('../../config/paths');

const runner = createRunner({
  plugins: [
    new LoaderPlugin({ oneLinerTasks: false }),
  ],
});

module.exports = runner.command(async ({
  webpack: webpackDev,
  webpack: webpackProd,
}) => {
  await webpackDev({ configPath: paths.config.webpack.production });
  await webpackProd({ configPath: paths.config.webpack.production });

  await Promise.all([
    webpackDev({ configPath: paths.config.webpack.production }),
    webpackDev({ configPath: paths.config.webpack.production }),
  ]);
});
