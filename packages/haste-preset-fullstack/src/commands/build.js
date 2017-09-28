const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { define } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const clean = define({ name: 'clean' });
  const babel = define({ name: 'babel' });
  // const sass = define({ name: 'sass' }); // TODO
  const copy = define({ name: 'copy' });
  const webpack = define({ name: 'webpack' });

  await clean({ pattern: `{${paths.build},${paths.target}}/*` });

  await Promise.all([
    // sass({ pattern: paths.javascripts, output: paths.build }),
    copy({ pattern: paths.assets, output: paths.build }),
    babel({ pattern: paths.javascripts, output: paths.build }),
    webpack({ configPath: paths.config.webpack.production }),
  ]);

  return {
    persistent: false,
  };
};

