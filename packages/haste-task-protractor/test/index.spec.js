const { run } = require('haste-test-utils');

const { command: protractor, kill } = run(require.resolve('../src'));

jest.setTimeout(30000);

describe('haste-protractor', () => {
  afterEach(kill);

  // it('should run protractor with a passing test and resolve', async () => {
  //   const configPath = require.resolve('./fixtures/passing.conf.js');
  //   const { task, stdout } = protractor({ configPath });

  //   return task()
  //     .then(() => {
  //       expect(stdout()).toMatch(/1 spec, 0 failures/);
  //     });
  // });

  it('should run protractor with a failing test and reject', async () => {
    // expect.assertions(1);

    const configPath = require.resolve('./fixtures/failing.conf.js');
    const { task, stdout } = protractor({ configPath });

    return task();
    // .catch(() => {
    //   expect(stdout()).toMatch(/1 spec, 1 failure/);
    // });
  });

  // it('should run protractor with a missing config and reject', async () => {
  //   expect.assertions(1);

  //   const configPath = 'missing.conf.js';
  //   const { task, stdout } = protractor({ configPath });

  //   return task()
  //     .catch(() => {
  //       expect(stdout()).toMatch(/Error message: failed loading configuration file missing.conf.js/);
  //     });
  // });
});
