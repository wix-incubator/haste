const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, watch } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  await run('clean', { pattern: `{${paths.build},${paths.target}}/*` });

  await Promise.all([
    // sass({ pattern: paths.javascripts, output: paths.build }),
    run('copy', { pattern: paths.assets, output: paths.build }),
    run('babel', { pattern: paths.javascripts, output: paths.build }),
    run('webpack-dev-server', { configPath: paths.config.webpack.development }),
  ]);

  // const restart = await server({ file });

  watch(paths.javascripts, async (changed) => {
    await run('babel', { pattern: changed, output: paths.build });
    // await restart();
  });

  // watch(paths.styles, async (changed) => {
  // await sass({ pattern: changed, output: paths.build });
  // });

  watch(paths.assets, async (changed) => {
    await run('copy', { pattern: changed, output: paths.build });
  });

  return {
    persistent: true,
  };
};
