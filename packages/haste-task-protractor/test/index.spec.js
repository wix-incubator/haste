// const protractor = require('../src');
const { run } = require('haste-test-utils');

const protractor = run(require.resolve('../src'));

jest.setTimeout(20000);

describe('haste-protractor', () => {
  it('should run protractor with a passing test and resolve', async () => {
    const configPath = require.resolve('./fixtures/passing.conf.js');
    const { task, stdout } = protractor({ configPath });

    return task()
      .then(() => {
        expect(stdout()).toMatch(/1 spec, 0 failures/);
      });
  });

  it('should run protractor with a failing test and reject', async () => {
    expect.assertions(1);

    const configPath = require.resolve('./fixtures/failing.conf.js');
    const { task, stdout } = protractor({ configPath });

    return task()
      .catch(() => {
        expect(stdout()).toMatch(/1 spec, 1 failure/);
      });
  });

  it('should run protractor with a missing config and reject', async () => {
    expect.assertions(1);

    const configPath = 'missing.conf.js';
    const { task, stdout } = protractor({ configPath });

    return task()
      .catch(() => {
        expect(stdout()).toMatch(/Error message: failed loading configuration file missing.conf.js/);
      });
  });

  it('should update webdriver manager', async () => {
    const configPath = require.resolve('./fixtures/passing.conf.js');
    const { task, stdout } = protractor({ configPath });

    return task()
      .then(() => {
        expect(stdout()).toMatch(/update - chromedriver: unzipping/);
      });
  });

  it('should pass cli arguments when updating webdriver manager', async () => {
    const configPath = require.resolve('./fixtures/passing.conf.js');
    const { task, stdout } = protractor({ configPath, webdriverManagerArgs: ['--versions.chrome', '2.28'] });

    return task()
      .then(() => {
        expect(stdout()).toMatch(/unzipping chromedriver_2.28.zip/);
      });
  });
});
