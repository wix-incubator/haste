const path = require('path');

module.exports = async ({ pattern, target, options }, { fs }) => {
  let sass;

  try {
    sass = require('node-sass');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        '`haste-task-sass` requires `node-sass` >=4. Please install it and re-run.',
      );
    }
    throw error;
  }

  const render = opts => new Promise((resolve, reject) => {
    sass.render(opts, (err, result) => err ? reject(err) : resolve(result));
  });

  const files = await fs.read({ pattern });

  return Promise.all(
    files
      .filter(({ filename }) => path.basename(filename)[0] !== '_')
      .map(async ({ filename, content }) => {
        const { css, map } = await render(Object.assign({
          file: filename,
          data: content,
          outFile: filename,
        }, options));

        return fs.write({
          target,
          filename,
          content: css.toString(),
          map: map && map.toString(),
        });
      }),
  );
};
