const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

describe('haste-eslint', () => {
  it('should pass for valid files', async () => {
    const { run } = await setup();

    await run(async ({ [taskPath]: eslint }) => {
      await eslint({
        pattern: require.resolve('./fixtures/valid.js'),
      });
    });
  });

  it('should fail for invalid files', async () => {
    expect.assertions(1);

    const { run } = await setup();

    await run(async ({ [taskPath]: eslint }) => {
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
    const { run, files } = await setup({
      'fixable.js': '/foo  bar/',
    });

    await run(async ({ [taskPath]: eslint }) => {
      await eslint({
        pattern: '*.js',
        options: { fix: true, rules: { 'no-regex-spaces': 'error' } },
      });
    });

    expect(files['fixable.js'].content).toBe('/foo {2}bar/');
  });
});
