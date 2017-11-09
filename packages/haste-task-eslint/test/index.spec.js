const { run } = require('haste-test-utils');
const eslint = require('../src');
const tempy = require('tempy');

describe('haste-eslint', () => {
  it('should pass for valid files', async () => {
    const task = eslint();

    const file = {
      filename: require.resolve('./fixtures/valid.js'),
    };

    const result = await task([file]);
    expect(result).toEqual(undefined);
  });

  it('should fail for invalid files', async () => {
    expect.assertions(1);

    const task = eslint({ rules: { 'no-console': 'error' } });

    const file = {
      filename: require.resolve('./fixtures/valid.js'),
    };
    try {
      await task([file]);
    } catch (result) {
      expect(result).toMatch(/Unexpected console statement/);
    }
  });

  it('should output fixes in case a "fix" option is passed', async () => {
    const cwd = tempy.directory();
    const { command, kill, setup } = run(require.resolve('../src'), { cwd });
    const { task } = command({ fix: true, rules: { 'no-regex-spaces': 'error' } });

    const filename = 'fixable.js';

    const fileSystem = setup({
      [filename]: '/foo  bar/'
    });

    const file = { filename };

    try {
      const result = await task([file]);
      expect(result).toEqual(undefined);
      expect(fileSystem['fixable.js']).toBe('/foo {2}bar/');
    } finally {
      kill();
    }
  });
});
