const fs = require('fs');
const path = require('path');
const { read } = require('../src');

describe('haste-service-fs', () => {
  describe('read', () => {
    const resolve = (...pathParts) => path.join(__dirname, 'fixtures', ...pathParts);
    const filename = resolve('file.txt');
    const nestedFilename = resolve('nested', 'folder', 'structure', 'nested.txt');

    it('should read from a filename', async () => {
      const expected = {
        filename,
        content: fs.readFileSync(filename, 'utf8'),
        cwd: process.cwd(),
      };

      const result = await read({
        pattern: filename,
      });

      expect(result).toEqual([expected]);
    });

    it('should read from a glob pattern', async () => {
      const pattern = resolve('**.*');

      const expected = {
        filename,
        content: fs.readFileSync(filename, 'utf8'),
        cwd: process.cwd(),
      };

      const result = await read({ pattern });

      expect(result).toEqual([expected]);
    });

    it('should read nested files but not the directories themselves', async () => {
      const pattern = resolve('nested', '**');

      const expected = {
        filename: nestedFilename,
        content: fs.readFileSync(nestedFilename, 'utf8'),
        cwd: process.cwd(),
      };

      const result = await read({ pattern });

      expect(result).toEqual([expected]);
    });

    it('should support passing a current working directory', async () => {
      const pattern = '**.*';
      const cwd = path.join(__dirname, 'fixtures');

      const expected = {
        filename: 'file.txt',
        content: fs.readFileSync(filename, 'utf8'),
        cwd,
      };

      const result = await read({ pattern, cwd });

      expect(result).toEqual([expected]);
    });

    it('should use a relative path source option to read files from', async () => {
      const pattern = resolve('nested', '**');
      const source = 'nested';

      const expected = {
        filename: nestedFilename,
        content: fs.readFileSync(nestedFilename, 'utf8'),
        cwd: path.join(process.cwd(), source),
      };

      const result = await read({ pattern, source });

      expect(result).toEqual([expected]);
    });

    it('should use an absolue path source option to read files from', async () => {
      const pattern = resolve('nested', '**');
      const absoluteSource = resolve('nested');

      const expected = {
        filename: nestedFilename,
        content: fs.readFileSync(nestedFilename, 'utf8'),
        cwd: absoluteSource,
      };

      const result = await read({ pattern, source: absoluteSource });

      expect(result).toEqual([expected]);
    });
  });
});
