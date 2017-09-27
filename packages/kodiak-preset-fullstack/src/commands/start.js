const LoggerPlugin = require('kodiak-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { define, watch } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const clean = define({ name: 'clean' });
  const babel = define({ name: 'babel' });
  // const sass = define({ name: 'sass' });
  const copy = define({ name: 'copy' });
  const webpackDevServer = define({ name: 'webpack-dev-server' });
  // const server = define({ name: 'server' });

  await clean({ pattern: `{${paths.build},${paths.target}}/*` });

  await Promise.all([
    // sass({ pattern: paths.javascripts, output: paths.build }),
    copy({ pattern: paths.assets, output: paths.build }),
    babel({ pattern: paths.javascripts, output: paths.build }),
    webpackDevServer({ configPath: paths.config.webpack.development }),
  ]);

  // const restart = await server({ file });

  watch(paths.javascripts, async (changed) => {
    await babel({ pattern: changed, output: paths.build });
    // await restart();
  });

  // watch(paths.styles, async (changed) => {
  // await sass({ pattern: changed, output: paths.build });
  // });

  watch(paths.assets, async (changed) => {
    await copy({ pattern: changed, output: paths.build });
  });

  return {
    persistent: true,
  };
};
