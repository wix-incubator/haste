jest.mock('execa');

const execa = require('execa');
const { run } = require('haste-test-utils');
const protractor = require('../src/index');

const { command: protractorCommand, kill } = run(require.resolve('../src'));

jest.setTimeout(30000);

describe('haste-protractor', () => {
  afterEach(kill);

  it('should run protractor with a passing test and resolve', async () => {
    const configPath = require.resolve('./fixtures/passing.conf.js');
    const { task, stdout } = protractorCommand({ configPath });

    return task()
      .then(() => {
        expect(stdout()).toMatch(/1 spec, 0 failures/);
      });
  });

  it('should run protractor with a failing test and reject', async () => {
    expect.assertions(1);

    const configPath = require.resolve('./fixtures/failing.conf.js');
    const { task, stdout } = protractorCommand({ configPath });

    return task()
      .catch(() => {
        expect(stdout()).toMatch(/1 spec, 1 failure/);
      });
  });

  it('should run protractor with a missing config and reject', async () => {
    expect.assertions(1);

    const configPath = 'missing.conf.js';
    const { task, stdout } = protractorCommand({ configPath });

    return task()
      .catch(() => {
        expect(stdout()).toMatch(/Error message: failed loading configuration file missing.conf.js/);
      });
  });

  it('should merge webdriver manager options with the default and transform to args', async () => {
    const webdriverManagerOptions = { gecko: 'true', standalone: true, 'versions.chrome': 2.29 };

    await protractor({ webdriverManagerOptions })();

    const expectedArgs = ['update', '--standalone', '--gecko', 'true', '--versions.chrome', '2.29'];
    expect(execa.mock.calls[0][1]).toEqual(expectedArgs);
  });
});
