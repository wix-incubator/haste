const { lint } = require('stylelint');

module.exports = async ({ pattern, options }, { fs }) => {
  const files = await fs.read({ pattern });

  const { output, errored } = await lint(Object.assign({
    files: files.map(({ filename }) => filename),
    formatter: 'string',
  }, options));

  if (errored) {
    throw output;
  }
};
