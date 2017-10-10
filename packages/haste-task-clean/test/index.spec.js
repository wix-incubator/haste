const fs = require('fs');
const path = require('path');
const tempWrite = require('temp-write');
const clean = require('../src');

describe('haste-clean', () => {
  it('should remove all files and folders a file path', async () => {
    const tempFilename = await tempWrite('foo', 'bar.txt');

    const task = clean({ pattern: tempFilename });

    return task()
      .then(() => {
        expect(fs.existsSync(tempFilename)).toEqual(false);
      });
  });

  it('should remove all files and folders a from a glob pattern', async () => {
    const tempFilename = await tempWrite('foo', 'bar.txt');

    const task = clean({ pattern: path.join(path.dirname(tempFilename), '**/*.*') });

    return task()
      .then(() => {
        expect(fs.existsSync(tempFilename)).toEqual(false);
      });
  });
});
