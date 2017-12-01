const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

describe('haste-babel', () => {
  it('should transpile with babel', async () => {
    const { run, files } = await setup({
      'test.js': 'const a = 5;'
    });

    await run(async ({ [taskPath]: babel }) => {
      await babel({
        pattern: '*.js',
        target: 'dist',
        plugins: [require.resolve('babel-plugin-transform-es2015-block-scoping')],
      });
    });

    expect(files['dist/test.js'].content).toEqual('var a = 5;');
  });

  it('should generate source maps', async () => {
    const { run, files } = await setup({
      'test.js': 'const a = 5;'
    });

    await run(async ({ [taskPath]: babel }) => {
      await babel({
        pattern: '*.js',
        target: 'dist',
        plugins: [require.resolve('babel-plugin-transform-es2015-block-scoping')],
        sourceMaps: true
      });
    });

    expect(files['dist/test.js'].content).toMatch('//# sourceMappingURL=test.js.map');

    const map = {
      file: 'test.js',
      mappings: 'AAAA,IAAMA,IAAI,CAAV',
      names: ['a'],
      sources: ['test.js'],
      sourcesContent: ['const a = 5;'],
      version: 3,
    };

    expect(JSON.parse(files['dist/test.js.map'].content)).toEqual(map);
  });

  it('should fail for invalid javascript', async () => {
    expect.assertions(1);

    const { run } = await setup({
      'test.js': 'invalid javascript'
    });

    await run(async ({ [taskPath]: babel }) => {
      try {
        await babel({
          pattern: '*.js',
          target: 'dist',
          plugins: [require.resolve('babel-plugin-transform-es2015-block-scoping')],
        });
      } catch (error) {
        expect(error.message).toMatch('test.js: Unexpected token, expected ; (1:8)');
      }
    });
  });
});
