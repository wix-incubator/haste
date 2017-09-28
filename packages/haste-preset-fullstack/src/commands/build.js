const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  await run('clean', { pattern: `{${paths.build},${paths.target}}/*` });

  await Promise.all([
    // sass({ pattern: paths.javascripts, output: paths.build }),
    run('copy', { pattern: paths.assets, output: paths.build }),
    run('babel', { pattern: paths.javascripts, output: paths.build }),
    run('webpack', { configPath: paths.config.webpack.production }),
  ]);

  return {
    persistent: false,
  };
};
