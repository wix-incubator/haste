const less = require('less');

const render = (content, options) => new Promise((resolve, reject) => {
  less.render(content, options, (err, result) => err ? reject(err) : resolve(result));
});

module.exports = async ({ pattern, target, options }, { fs }) => {
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
