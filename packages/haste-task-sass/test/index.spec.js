const fs = require('fs');
const path = require('path');
const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const fromFixture = (filename) => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

describe('haste-sass', () => {
  it('should transpile scss to css', async () => {
    const { run, files } = await setup({
      'test.scss': fromFixture('fixtures/test.scss'),
    });

    await run(async ({ [taskPath]: sass }) => {
      await sass({
        pattern: '*.scss',
        target: 'dist',
      });
    });

    const expected = fromFixture('expected/test.css');

    expect(files['dist/test.scss'].content).toMatch(expected);
  });

  it('should fail for invalid scss', async () => {
    expect.assertions(1);

    const { run } = await setup({
      'invalid.scss': fromFixture('fixtures/invalid.scss'),
    });

    await run(async ({ [taskPath]: sass }) => {
      try {
        await sass({
          pattern: '*.scss',
          target: 'dist',
        });
      } catch (error) {
        expect(error.message).toMatch('Invalid CSS after "hello world": expected "{", was ""');
      }
    });
  });

  it('should handle includePaths', async () => {
    const { run, files } = await setup({
      'includePaths.scss': fromFixture('fixtures/includePaths.scss'),
    });

    await run(async ({ [taskPath]: sass }) => {
      await sass({
        pattern: '*.scss',
        target: 'dist',
        options: { includePaths: [path.join(__dirname, 'fixtures')] },
      });
    });

    const expected = fromFixture('expected/includePaths.css');

    expect(files['dist/includePaths.scss'].content).toMatch(expected);
  });

  it('should ignore underscore partial files', async () => {
    const { run, files } = await setup({
      '_partial.scss': fromFixture('fixtures/test.scss'),
    });

    await run(async ({ [taskPath]: sass }) => {
      await sass({
        pattern: '*.scss',
        target: 'dist',
      });
    });

    expect(files['dist/_partial.scss'].exists).toEqual(false);
  });

  it('should generate source maps', async () => {
    const { run, files } = await setup({
      'test.scss': fromFixture('fixtures/test.scss'),
    });

    await run(async ({ [taskPath]: sass }) => {
      await sass({
        pattern: '*.scss',
        target: 'dist',
        options: { sourceMap: true },
      });
    });

    const map = {
      version: 3,
      file: 'test.scss',
      sources: [
        'test.scss'
      ],
      names: [],
      mappings: 'AAGA,AAAA,mBAAmB,CAAC;EACnB,YAAY,EAJN,OAAO;EAKb,KAAK,EACJ,OAAiB,GAClB;;AAED,AAAA,OAAO,CAAC;EACP,OAAO,EAAE,GAAW;EACpB,MAAM,EAAE,GAAW;EACnB,YAAY,EAZN,OAAO,GAab'
    };

    expect(files['dist/test.scss'].content).toMatch('/*# sourceMappingURL=test.scss.map');
    expect(JSON.parse(files['dist/test.scss.map'].content)).toEqual(map);
  });

  it('should support precision option', async () => {
    const { run, files } = await setup({
      'precision.scss': fromFixture('fixtures/precision.scss'),
    });

    await run(async ({ [taskPath]: sass }) => {
      await sass({
        pattern: '*.scss',
        target: 'dist',
        options: { precision: 3 },
      });
    });

    expect(files['dist/precision.scss'].content).toMatch('1.343');
  });
});
