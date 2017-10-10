const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const write = require('../src');

describe('haste-write', () => {
  it('should create a file at target directory', async () => {
    const target = tempy.directory();

    const file = {
      filename: 'test.js',
      content: 'const a = 5;',
    };

    const task = write({ target });

    return task([file])
      .then(() => {
        expect(fs.existsSync(path.join(target, file.filename))).toEqual(true);
      });
  });
});
