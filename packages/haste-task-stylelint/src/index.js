const { lint } = require('stylelint');

module.exports = options => async (files) => {
  const { output, errored } = await lint(Object.assign({
    files: files.map(({ filename }) => filename),
    formatter: 'string',
  }, options));

  if (errored) {
    return Promise.reject(output);
  }

  return Promise.resolve();
};
