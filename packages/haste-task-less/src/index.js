const less = require('less');

const render = (content, options) => new Promise((resolve, reject) => {
  less.render(content, options, (err, result) => err ? reject(err) : resolve(result));
});

module.exports = options => (input) => {
  return Promise.all(
    input
      .map(async ({ filename, content }) => {
        const { css, map } = await render(content, Object.assign({ filename }, options));

        console.log(`compiled - ${filename}`);

        return {
          filename,
          content: css,
          map: map ? JSON.parse(map) : undefined,
        };
      })
  );
};
