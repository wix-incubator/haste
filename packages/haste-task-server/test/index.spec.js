const { run } = require('haste-test-utils');
const retry = require('retry-promise').default;

const server = run(require.resolve('../src'));

describe('haste-server', () => {
  it('should spawn a new node script', () => {
    const { task, stdout } = server({ serverPath: require.resolve('./fixtures/server') });
    const result = task();

    return retry(() => result
      .then(() => {
        expect(stdout()).toContain('hello world');
      })
    );
  });
});
