module.exports = async ({ pattern, target, options }, { fs }) => {
  let less;
  let lessVersion;

  try {
    less = require('less');
    lessVersion = /^(\d+)/.exec(require('less/package.json').version).pop();
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'Running this requires `less` >=2. Please install it and re-run.',
      );
    }
    throw error;
  }

  if (Number(lessVersion) < 2) {
    throw new Error(
      `The installed version of \`less\` is not compatible (expected: >= 2, actual: ${lessVersion}).`,
    );
  }

  const render = (content, opts) => new Promise((resolve, reject) => {
    less.render(content, opts, (err, result) => err ? reject(err) : resolve(result));
  });

  const files = await fs.read({ pattern });

  return Promise.all(
    files
      .map(async ({ filename, content }) => {
        const { css, map } = await render(content, Object.assign({ filename }, options));

        return fs.write({
          target,
          filename,
          content: css,
          map,
        });
      }),
  );
};
