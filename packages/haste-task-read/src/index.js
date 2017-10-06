const fs = require('fs');
const globby = require('globby');

const readFile = file => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf8', (err, data) => err ? reject(err) : resolve(data));
});

module.exports = ({ pattern }) => async () => {
  const files = await globby(pattern);

  return Promise.all(
    files.map((filename) => {
      return readFile(filename)
        .then((content) => {
          return {
            content,
            filename,
          };
        });
    })
  );
};
