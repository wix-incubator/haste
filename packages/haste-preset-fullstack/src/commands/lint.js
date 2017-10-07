const LoaderPlugin = require('haste-plugin-loader');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run } = configure({
    plugins: [
      new LoaderPlugin({ oneLinerTasks: false }),
    ],
  });

  await run(
    { task: 'read', options: { pattern: `${paths.src}/**/*.js` } },
    { task: 'eslint' }
  );
};
