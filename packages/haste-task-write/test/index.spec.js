const fs = require('fs');
const os = require('os');
const path = require('path');
const uuid = require('uuid/v4');
const write = require('../src');

describe('haste-write', () => {
  it('should create a file at target directory', async () => {
    const target = path.join(os.tmpdir(), uuid());

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

  it('should create a file with nested directories that don\'t exist', async () => {
    const target = path.join(os.tmpdir(), uuid(), uuid());

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
