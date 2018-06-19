const path = require('path');

module.exports = async ({ pattern, target, options }, { fs }) => {
  let sass;
  let sassVersion;

  try {
    sass = require('node-sass');
    sassVersion = /^(\d+)/.exec(require('node-sass/package.json').version).pop();
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'Running this requires `node-sass` >=4. Please install it and re-run.',
      );
    }
    throw error;
  }

  if (Number(sassVersion) < 4) {
    throw new Error(
      `The installed version of \`node-sass\` is not compatible (expected: >= 4, actual: ${sassVersion}).`,
    );
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
