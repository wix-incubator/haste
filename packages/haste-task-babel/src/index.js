const { transform } = require('babel-core');

module.exports = options => async (files) => {
  return files.map(({ filename, content }) => {
    try {
      const { code, map } = transform(content, Object.assign({ filename }, options));

      console.log('compiled - ', filename);

      return {
        filename,
        content: code,
        map
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
};
