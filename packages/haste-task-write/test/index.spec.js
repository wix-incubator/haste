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

  it('should support a base option', async () => {
    const base = 'foo';
    const target = tempy.directory();

    const file = {
      filename: `${base}/bar/test.js`,
      content: 'const a = 5;',
    };

    const expectedFilename = 'bar/test.js';

    const task = write({ target, base });

    return task([file])
      .then(() => {
        expect(fs.existsSync(path.join(target, expectedFilename))).toEqual(true);
      });
  });

  it('should write source maps if they exist', async () => {
    const target = tempy.directory();

    const file = {
      filename: 'test.js',
      content: 'const a = 5;',
      map: {
        hello: 'world'
      },
    };

    const task = write({ target });

    return task([file])
      .then(() => {
        const mapContent = fs
          .readFileSync(path.join(target, `${file.filename}.map`))
          .toString();

        expect(mapContent).toEqual(JSON.stringify(file.map));
      });
  });
});
