const { transform } = require('babel-core');

module.exports = () => async (files) => {
  return files.map(({ filename, content }) => {
    const { code, map } = transform(content, { filename });

    return {
      filename,
      content: code,
      map
    };
  });
};
