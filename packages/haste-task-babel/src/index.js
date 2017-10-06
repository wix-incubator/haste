const { transform } = require('babel-core');

module.exports = options => async (files) => {
  return files.map(({ filename, content }) => {
    const { code, map } = transform(content, Object.assign({ filename }, options));

    console.log(`compiled - ${filename}`);

    return {
      filename,
      content: code,
      map
    };
  });
};
