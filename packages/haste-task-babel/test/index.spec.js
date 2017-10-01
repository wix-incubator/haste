const babel = require('../src');

describe('haste-babel', () => {
  it('should transpile with babel', async () => {
    expect.assertions(1);

    const task = babel({ plugins: [require.resolve('babel-plugin-transform-es2015-block-scoping')] });

    const file = {
      filename: 'foo.js',
      content: 'const a = 5;',
    };

    const expected = {
      filename: 'foo.js',
      content: 'var a = 5;',
      map: null,
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual([expected]);
      });
  });

  it('should generate source maps', () => {
    expect.assertions(1);

    const task = babel({ sourceMaps: true });

    const file = {
      filename: 'foo.js',
      content: 'const a = 5;',
    };

    const expected = {
      filename: 'foo.js',
      content: 'const a = 5;',
      map: {
        file: 'foo.js',
        mappings: 'AAAA,MAAMA,IAAI,CAAV',
        names: ['a'],
        sources: ['foo.js'],
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
      filename: 'foo.js',
      content: 'hello world',
    };

    return task([file])
      .catch((error) => {
        expect(error.message).toEqual('foo.js: Unexpected token, expected ; (1:6)');
      });
  });
});
