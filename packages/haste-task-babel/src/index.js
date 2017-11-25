const { transform } = require('babel-core');

const defaultOptions = {
  ast: false,
};

module.exports = async ({ pattern, target, ...options }, { fs }) => {
  const files = await fs.read({ pattern });

  return Promise.all(
    files
      .map(({ filename, content }) => {
        const { code, map } = transform(content, {
          ...defaultOptions,
          ...options,
          filename,
        });

        return fs.write({
          target,
          filename,
          content: code,
          map,
        });
      })
  );
};
