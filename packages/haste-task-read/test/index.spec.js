const fs = require('fs');
const path = require('path');
const read = require('../src');

describe('haste-read', () => {
  const resolve = (...pathParts) => path.join(__dirname, 'fixtures', ...pathParts);
  const filename = resolve('file.txt');
  const nestedFilename = resolve('nested', 'folder', 'structure', 'nested.txt');
  const filteredFilename = resolve('filter', 'file.txt');

  it('should read from a filename', async () => {
    const task = read({ pattern: filename });

    const expected = {
      filename,
      content: fs.readFileSync(filename, 'utf8'),
    };

    const result = await task();

    expect(result).toEqual([expected]);
  });

  it('should read from a glob pattern', async () => {
    const pattern = resolve('**.*');
    const task = read({ pattern });

    const expected = {
      filename,
      content: fs.readFileSync(filename, 'utf8'),
    };

    const result = await task();

    expect(result).toEqual([expected]);
  });

  it('should filter files using the passed filter function', async () => {
    const pattern = resolve('filter', '**.*');
    const noUnderscorePrefix = str => !path.basename(str).startsWith('_');

    const task = read({ pattern, filter: noUnderscorePrefix });

    const expected = {
      filename: filteredFilename,
      content: fs.readFileSync(filteredFilename, 'utf8'),
    };

    const result = await task();

    expect(result).toEqual([expected]);
  });

  it('should not read directories', async () => {
    const pattern = resolve('nested', '**');
    const task = read({ pattern });

    const expected = {
      filename: nestedFilename,
      content: fs.readFileSync(nestedFilename, 'utf8'),
    };

    const result = await task();

    expect(result).toEqual([expected]);
  });
});
