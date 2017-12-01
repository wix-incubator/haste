const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

describe('haste-clean', () => {
  it('should remove all files and folders a file path', async () => {
    const { run, files } = await setup({
      'foo.txt': 'bar',
    });

    await run(async ({ [taskPath]: clean }) => {
      await clean({
        pattern: 'foo.txt',
      });
    });

    expect(files['foo.txt'].exists).toEqual(false);
  });

  it('should remove all files and folders a from a glob pattern', async () => {
    const { run, files } = await setup({
      'foo.txt': 'bar',
    });

    await run(async ({ [taskPath]: clean }) => {
      await clean({
        pattern: '*.txt',
      });
    });

    expect(files['foo.txt'].exists).toEqual(false);
  });
});
