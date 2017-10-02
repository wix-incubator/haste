const babel = require('../src');

describe('haste-babel', () => {
  it('should transpile with babel', () => {
    const task = babel({ plugins: [require.resolve('babel-plugin-transform-es2015-block-scoping')] });

    const file = {
      filename: 'test.js',
      content: 'const a = 5;',
    };

    const expected = {
      filename: 'test.js',
      content: 'var a = 5;',
      map: null,
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual([expected]);
      });
  });

  it('should generate source maps', () => {
    const task = babel({ sourceMaps: true });

    const file = {
      filename: 'test.js',
      content: 'const a = 5;',
    };

    const expected = {
      filename: 'test.js',
      content: 'const a = 5;',
      map: {
        file: 'test.js',
        mappings: 'AAAA,MAAMA,IAAI,CAAV',
        names: ['a'],
        sources: ['test.js'],
        sourcesContent: ['const a = 5;'],
        version: 3,
      },
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual([expected]);
      });
  });

  it('should fail for invalid javascript', () => {
    expect.assertions(1);

    const task = babel();

    const file = {
      filename: 'test.js',
      content: 'hello world',
    };

    return task([file])
      .catch((error) => {
        expect(error.message).toEqual('test.js: Unexpected token, expected ; (1:6)');
      });
  });
});
