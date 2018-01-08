const fs = require('fs');
const path = require('path');
const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const fromFixture = (filename) => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

describe('haste-sass', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should transpile scss to css', async () => {
    test = await setup({
      'test.scss': fromFixture('fixtures/test.scss'),
    });

    await test.run(async ({ [taskPath]: sass }) => {
      await sass({
        pattern: '*.scss',
        target: 'dist',
      });
    });

    const expected = fromFixture('expected/test.css');

    expect(test.files['dist/test.scss'].content).toMatch(expected);
  });

  it('should fail for invalid scss', async () => {
    expect.assertions(1);

    test = await setup({
      'invalid.scss': fromFixture('fixtures/invalid.scss'),
    });

    await test.run(async ({ [taskPath]: sass }) => {
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
    test = await setup({
      'includePaths.scss': fromFixture('fixtures/includePaths.scss'),
    });

    await test.run(async ({ [taskPath]: sass }) => {
      await sass({
        pattern: '*.scss',
        target: 'dist',
        options: { includePaths: [path.join(__dirname, 'fixtures')] },
      });
    });

    const expected = fromFixture('expected/includePaths.css');

    expect(test.files['dist/includePaths.scss'].content).toMatch(expected);
  });

  it('should ignore underscore partial files', async () => {
    test = await setup({
      '_partial.scss': fromFixture('fixtures/test.scss'),
    });

    await test.run(async ({ [taskPath]: sass }) => {
      await sass({
        pattern: '*.scss',
        target: 'dist',
      });
    });

    expect(test.files['dist/_partial.scss'].exists).toEqual(false);
  });

  it('should generate source maps', async () => {
    test = await setup({
      'test.scss': fromFixture('fixtures/test.scss'),
    });

    await test.run(async ({ [taskPath]: sass }) => {
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
        'test.scss',
      ],
      names: [],
      mappings: 'AAGA,AAAA,mBAAmB,CAAC;EACnB,YAAY,EAJN,OAAO;EAKb,KAAK,EACJ,OAAiB,GAClB;;AAED,AAAA,OAAO,CAAC;EACP,OAAO,EAAE,GAAW;EACpB,MAAM,EAAE,GAAW;EACnB,YAAY,EAZN,OAAO,GAab',
    };

    expect(test.files['dist/test.scss'].content).toMatch('/*# sourceMappingURL=test.scss.map');
    expect(JSON.parse(test.files['dist/test.scss.map'].content)).toEqual(map);
  });

  it('should support precision option', async () => {
    test = await setup({
      'precision.scss': fromFixture('fixtures/precision.scss'),
    });

    await test.run(async ({ [taskPath]: sass }) => {
      await sass({
        pattern: '*.scss',
        target: 'dist',
        options: { precision: 3 },
      });
    });

    expect(test.files['dist/precision.scss'].content).toMatch('1.343');
  });
});
