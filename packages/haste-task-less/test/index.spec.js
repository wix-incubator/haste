const fs = require('fs');
const path = require('path');
const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const fromFixture = (filename) => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

describe('haste-less', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should transpile less to css', async () => {
    test = await setup({
      'test.less': fromFixture('fixtures/test.less'),
    });

    await test.run(async ({ [taskPath]: less }) => {
      await less({
        pattern: '*.less',
        target: 'dist',
      });
    });

    const expected = fromFixture('expected/test.css');

    expect(test.files['dist/test.less'].content).toMatch(expected);
  });

  it('should fail for invalid less', async () => {
    expect.assertions(1);

    test = await setup({
      'invalid.less': fromFixture('fixtures/invalid.less'),
    });

    await test.run(async ({ [taskPath]: less }) => {
      try {
        await less({
          pattern: '*.less',
          target: 'dist',
        });
      } catch (error) {
        expect(error.message).toMatch('Unrecognised input. Possibly missing something');
      }
    });
  });

  it('should generate source maps', async () => {
    test = await setup({
      'test.less': fromFixture('fixtures/test.less'),
    });

    await test.run(async ({ [taskPath]: less }) => {
      await less({
        pattern: '*.less',
        target: 'dist',
        options: { sourceMap: { outputSourceFiles: true } },
      });
    });

    const map = {
      version: 3,
      sources: ['test.less'],
      names: [],
      mappings: 'AAGA;EACC,qBAAA;EACA,cAAA;;AAID;EACC,YAAA;EACA,WAAA;EACA,qBAAA',
      sourcesContent: [
        fromFixture('fixtures/test.less'),
      ],
    };

    expect(JSON.parse(test.files['dist/test.less.map'].content)).toEqual(map);
  });

  it('should handle includePaths', async () => {
    test = await setup({
      'includePaths.less': fromFixture('fixtures/includePaths.less'),
    });

    await test.run(async ({ [taskPath]: less }) => {
      await less({
        pattern: '*.less',
        target: 'dist',
        options: { paths: [path.join(__dirname, 'fixtures')] },
      });
    });

    const expected = fromFixture('expected/includePaths.css');

    expect(test.files['dist/includePaths.less'].content).toMatch(expected);
  });
});
