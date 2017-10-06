const path = require('path');
const sass = require('node-sass');

const render = options => new Promise((resolve, reject) => {
  sass.render(options, (err, result) => err ? reject(err) : resolve(result));
});

module.exports = options => (input) => {
  return Promise.all(
    input
      .filter(({ filename }) => path.basename(filename)[0] !== '_')
      .map(async ({ filename, content }) => {
        const { css, map } = await render(Object.assign({
          file: filename,
          data: content,
          outFile: filename,
        }, options));

        console.log(`compiled - ${filename}`);

        return {
          filename,
          content: css.toString(),
          map: map ? map.toString() : undefined,
        };
      })
  );
};
