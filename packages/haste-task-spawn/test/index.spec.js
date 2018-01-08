const retry = require('retry-promise').default;
const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

describe('haste-spawn', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should spawn a new node script', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: server }) => {
      await server({ serverPath: require.resolve('./fixtures/server') });
    });

    await retry(async () => {
      expect(test.stdio.stdout).toContain('hello world');
    });
  });
});
