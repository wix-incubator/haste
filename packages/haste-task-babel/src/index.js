const { transform } = require('babel-core');

module.exports = () => async (input) => {
  return input.map(({ filename, content }) => {
    const { code, map } = transform(content, { filename });

    return {
      filename,
      content: code,
      map
    };
  });
};
