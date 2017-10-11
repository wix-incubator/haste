const retry = require('retry-promise').default;
const run = require('../../teskit');

const server = run(require.resolve('../src'));

describe('haste-server', () => {
  it('should spawn a new node script', () => {
    const task = server({ serverPath: require.resolve('./fixtures/server') });
    const result = task();

    return retry(() => result
      .then(({ stdout }) => {
        expect(stdout()).toContain('hello world');
      })
    );
  });
});
