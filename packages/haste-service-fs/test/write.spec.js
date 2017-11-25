const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const { write } = require('../src');

describe.only('haste-service-fs', () => {
  describe('write', () => {
    it('should create a file at target directory', async () => {
      const target = tempy.directory();

      const file = {
        filename: 'test.js',
        content: 'const a = 5;',
      };

      await write({ target, ...file });

      expect(fs.existsSync(path.join(target, file.filename))).toEqual(true);
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

      await write({ target, ...file });

      const content = fs
        .readFileSync(path.join(target, `${file.filename}.map`))
        .toString();

      expect(content).toEqual(JSON.stringify(file.map));
    });

    it('should link to source maps from source files', async () => {
      const target = tempy.directory();

      const file = {
        filename: 'test.js',
        content: 'const a = 5;',
        map: {
          hello: 'world'
        },
      };

      await write({ target, ...file });

      const content = fs
        .readFileSync(path.join(target, file.filename))
        .toString();

      expect(content).toMatch(`//# sourceMappingURL=${file.filename}`);
    });
  });
});
