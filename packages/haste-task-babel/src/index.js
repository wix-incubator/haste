const { transform } = require('babel-core');

const defaultOptions = {
  ast: false,
};

module.exports = options => async (files) => {
  return files.map(({ filename, content }) => {
    const { code, map } = transform(content, {
      ...defaultOptions,
      ...options,
      filename,
    });

    return {
      filename,
      content: code,
      map
    };
  });
};
