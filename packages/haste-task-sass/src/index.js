const path = require('path');

function loadSass() {
  try {
    return require('sass');
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }
  }

  try {
    const sass = require('node-sass');
    const version = /^(\d+)/.exec(require('node-sass/package.json').version).pop();
    if (Number(version) < 4) {
      throw new Error(
        `The installed version of \`node-sass\` is not compatible (expected: >= 4, actual: ${version}).`,
      );
    }
    return sass;
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }
  }

  throw new Error(
    'Running this requires `sass` or `node-sass`. Please install one and re-run.',
  );
}

module.exports = async ({ pattern, target, options }, { fs }) => {
  const sass = loadSass();

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
