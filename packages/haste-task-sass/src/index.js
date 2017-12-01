const path = require('path');
const sass = require('node-sass');

const render = options => new Promise((resolve, reject) => {
  sass.render(options, (err, result) => err ? reject(err) : resolve(result));
});

module.exports = async ({ pattern, target, options }, { fs }) => {
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
          map: map ? JSON.parse(map.toString()) : undefined,
        });
      })
  );
};
