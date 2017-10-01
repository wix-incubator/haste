const sass = require('node-sass');

const render = options => new Promise((resolve, reject) => {
  sass.render(options, (err, result) => err ? reject(err) : resolve(result));
});

module.exports = () => (input) => {
  return Promise.all(
    input.map(async ({ filename, content }) => {
      const { css, map } = await render({
        file: filename,
        data: content,
      });

      return {
        filename,
        content: css.toString(),
        map,
      };
    })
  );
};
