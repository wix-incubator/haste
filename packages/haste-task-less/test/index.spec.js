const fs = require('fs');
const path = require('path');
const less = require('../src');

describe('haste-less', () => {
  it('should transpile less to css', () => {
    const task = less();

    const file = {
      filename: 'test.less',
      content: fs.readFileSync(path.join(__dirname, 'fixtures/test.less'), 'utf8'),
    };

    const expected = {
      filename: 'test.less',
      content: fs.readFileSync(path.join(__dirname, 'expected/test.css'), 'utf8'),
      map: undefined,
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual([expected]);
      });
  });

  it('should fail for invalid less', () => {
    expect.assertions(1);

    const task = less();

    const file = {
      filename: 'invalid.less',
      content: fs.readFileSync(path.join(__dirname, 'fixtures/invalid.less'), 'utf8'),
    };

    return task([file])
      .catch((error) => {
        expect(error.message).toEqual('Unrecognised input. Possibly missing something');
      });
  });

  it('should generate source maps', () => {
    const task = less({ sourceMap: { outputSourceFiles: true } });

    const file = {
      filename: 'test.less',
      content: fs.readFileSync(path.join(__dirname, 'fixtures/test.less'), 'utf8'),
    };

    const expected = {
      filename: 'test.less',
      content: fs.readFileSync(path.join(__dirname, 'expected/test.css'), 'utf8'),
      map: {
        version: 3,
        sources: ['test.less'],
        names: [],
        mappings: 'AAGA;EACC,qBAAA;EACA,cAAA;;AAID;EACC,YAAA;EACA,WAAA;EACA,qBAAA',
        sourcesContent: [
          fs.readFileSync(path.join(__dirname, 'fixtures/test.less'), 'utf8')
        ]
      },
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual([expected]);
      });
  });

  it('should handle includePaths', () => {
    const task = less({ paths: [path.join(__dirname, 'fixtures')] });

    const file = {
      filename: 'includePaths.less',
      content: fs.readFileSync(path.join(__dirname, 'fixtures/includePaths.less'), 'utf8'),
    };

    const expected = {
      filename: 'includePaths.less',
      content: fs.readFileSync(path.join(__dirname, 'expected/includePaths.css'), 'utf8'),
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual([expected]);
      });
  });
});
