const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

describe('haste-eslint', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should pass for valid files', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: eslint }) => {
      await eslint({
        pattern: require.resolve('./fixtures/valid.js'),
      });
    });
  });

  it('should fail for invalid files', async () => {
    expect.assertions(1);

    test = await setup();

    await test.run(async ({ [taskPath]: eslint }) => {
      try {
        await eslint({
          pattern: require.resolve('./fixtures/valid.js'),
          options: { rules: { 'no-console': 'error' } },
        });
      } catch (error) {
        expect(error.message).toMatch('Unexpected console statement');
      }
    });
  });

  it('should output fixes in case a "fix" option is passed', async () => {
    test = await setup({
      'fixable.js': '/foo  bar/',
    });

    await test.run(async ({ [taskPath]: eslint }) => {
      await eslint({
        pattern: '*.js',
        options: { fix: true, rules: { 'no-regex-spaces': 'error' } },
      });
    });

    expect(test.files['fixable.js'].content).toBe('/foo {2}bar/');
  });

  it('should support formatter', async () => {
    expect.assertions(1);

    test = await setup();

    await test.run(async ({ [taskPath]: eslint }) => {
      try {
        await eslint({
          pattern: require.resolve('./fixtures/valid.js'),
          options: { rules: { 'no-console': 'error' }, formatter: 'checkstyle' },
        });
      } catch (error) {
        expect(error.message).toMatch('message="Unexpected console statement. (no-console)"');
      }
    });
  });
});
