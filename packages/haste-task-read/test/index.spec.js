const fs = require('fs');
const path = require('path');
const read = require('../src');

describe('haste-read', () => {
  const resolve = filename => path.join(__dirname, 'fixtures', filename);
  const filename = resolve('some-file.txt');

  it('should read from a filename', () => {
    const task = read({ pattern: filename });

    const expected = {
      filename,
      content: fs.readFileSync(filename, 'utf8'),
    };

    return task()
      .then((result) => {
        expect(result).toEqual([expected]);
      });
  });

  it('should read from a glob pattern', () => {
    const pattern = resolve('**/*.*');
    const task = read({ pattern });

    const expected = {
      filename,
      content: fs.readFileSync(filename, 'utf8'),
    };

    return task()
      .then((result) => {
        expect(result).toEqual([expected]);
      });
  });
});
