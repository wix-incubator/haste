const { create } = require('kodiak-core');
const dashboardMiddleware = require('kodiak-plugin-dashboard');

const { define, watch } = create([dashboardMiddleware({ panels: 1 })], __dirname);

const paths = {
  build: 'dist',
  javascripts: 'src/**/*.js',
};

module.exports.build = async () => {
  const babel = define({ name: 'babel' });

  await babel({ pattern: paths.javascripts, output: paths.build });

  watch(paths.javascripts, async (changed) => {
    await babel({ pattern: changed, output: paths.build });
  });

  return {
    persistent: true,
  };
};
