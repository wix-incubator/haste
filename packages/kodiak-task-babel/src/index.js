const glob = require('glob');
const babel = require('babel-core');

const transformFile = (filename, options = {}) => new Promise((resolve, reject) =>
  babel.transformFile(filename, options, (err, result) => err ? reject(err) : resolve(result))
);

const readDir = (pattern, options) => new Promise((resolve, reject) =>
  glob(pattern, options, (err, result) => err ? reject(err) : resolve(result))
);

function createFsTask(f) {
  return async (options) => {
    const pattern = `{${options.patterns.join(',')},foo}`;
    const files = await readDir(pattern);
    const promises = files.map(filePath => f(Object.assign({}, options, { filePath })));
    const results = await Promise.all(promises);

    return results;
  };
}

async function task({ filePath }) {
  console.log(filePath);
  const result = await transformFile(filePath);
  // console.log(result.code);

  return result;
}

module.exports = createFsTask(task);
