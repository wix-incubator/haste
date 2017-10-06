const LoaderPlugin = require('haste-plugin-loader');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run } = configure({
    plugins: [
      new LoaderPlugin({ oneLinerTasks: false }),
    ],
  });

  await run({ name: 'eslint', options: { patterns: [`${paths.src}/**/*.js`] } });
};
