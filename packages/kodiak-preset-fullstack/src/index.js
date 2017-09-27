const LoggerPlugin = require('kodiak-plugin-logger');

const paths = {
  build: 'dist',
  target: 'target',
  javascripts: 'src/**/*.js',
};

module.exports.build = async (configure) => {
  const { define, watch } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const clean = define({ name: 'clean' });

  const babel = define({ name: 'babel' });

  await Promise.all([
    clean({ pattern: `{${paths.build},${paths.target}}/*` }),
  ]);

  await Promise.all([
    babel({ pattern: paths.javascripts, output: paths.build }),
  ]);

  watch(paths.javascripts, async (changed) => {
    await babel({ pattern: changed, output: paths.build });
  });

  return {
    persistent: true,
  };
};
