const fs = require('fs');
const path = require('path');
const sass = require('../src');

describe('haste-sass', () => {
  it('should transpile scss to css', () => {
    const task = sass();

    const file = {
      filename: 'test.scss',
      content: fs.readFileSync(path.join(__dirname, 'fixtures/test.scss'), 'utf8'),
    };

    const expected = {
      filename: 'test.scss',
      content: fs.readFileSync(path.join(__dirname, 'expected/test.css'), 'utf8'),
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual([expected]);
      });
  });

  it('should fail for invalid scss', () => {
    expect.assertions(1);

    const task = sass();

    const file = {
      filename: 'invalid.scss',
      content: fs.readFileSync(path.join(__dirname, 'fixtures/invalid.scss'), 'utf8'),
    };

    return task([file])
      .catch((error) => {
        expect(error.message).toEqual('Invalid CSS after "hello world": expected "{", was ""');
      });
  });

  it('should handle includePaths', () => {
    const task = sass({ includePaths: [path.join(__dirname, 'fixtures')] });

    const file = {
      filename: 'test.scss',
      content: fs.readFileSync(path.join(__dirname, 'fixtures/includePaths.scss'), 'utf8'),
    };

    const expected = {
      filename: 'test.scss',
      content: fs.readFileSync(path.join(__dirname, 'expected/includePaths.css'), 'utf8'),
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual([expected]);
      });
  });

  it('should ignore underscore partial files', () => {
    const task = sass();

    const file = {
      filename: '_partial.scss',
      content: fs.readFileSync(path.join(__dirname, 'fixtures/test.scss'), 'utf8'),
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual([]);
      });
  });

  it('should generate source maps', () => {
    const task = sass({ sourceMap: true });

    const file = {
      filename: 'test.scss',
      content: fs.readFileSync(path.join(__dirname, 'fixtures/test.scss'), 'utf8'),
    };

    return task([file])
      .then(([result]) => {
        expect(result.content).toMatch(/\/\*# sourceMappingURL=test\.scss\.map/);
        expect(result.map).toMatch(/test\.scss"/);
      });
  });

  it('should support precision option', () => {
    const task = sass({ precision: 3 });

    const file = {
      filename: 'precision.scss',
      content: fs.readFileSync(path.join(__dirname, 'fixtures/precision.scss'), 'utf8'),
    };

    return task([file])
      .then(([result]) => {
        expect(result.content).toMatch(/1\.343/);
      });
  });
});
