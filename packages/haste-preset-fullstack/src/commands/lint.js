const LoaderPlugin = require('haste-plugin-loader');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, tasks } = configure({
    plugins: [
      new LoaderPlugin({ oneLinerTasks: false }),
    ],
  });

  const { read, eslint } = tasks;

  await run(
    read({ pattern: `${paths.src}/**/*.js` }),
    eslint(),
  );
};
