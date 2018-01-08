const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

describe('haste-clean', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should remove all files and folders a file path', async () => {
    test = await setup({
      'foo.txt': 'bar',
    });

    await test.run(async ({ [taskPath]: clean }) => {
      await clean({
        pattern: 'foo.txt',
      });
    });

    expect(test.files['foo.txt'].exists).toEqual(false);
  });

  it('should remove all files and folders a from a glob pattern', async () => {
    test = await setup({
      'foo.txt': 'bar',
    });

    await test.run(async ({ [taskPath]: clean }) => {
      await clean({
        pattern: '*.txt',
      });
    });

    expect(test.files['foo.txt'].exists).toEqual(false);
  });
});
