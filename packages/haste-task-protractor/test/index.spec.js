const { run } = require('haste-test-utils');

const { command: protractorCommand, kill } = run(require.resolve('../src'));

jest.setTimeout(30000);

describe('haste-protractor', () => {
  describe('e2e', () => {
    afterEach(kill);

    it('should run protractor with a passing test and resolve', async () => {
      const configPath = require.resolve('./fixtures/passing.conf.js');
      const { task, stdout } = protractorCommand({ configPath });

      await task();

      expect(stdout()).toMatch(/1 spec, 0 failures/);
    });

    it('should run protractor with a failing test and reject', async () => {
      expect.assertions(1);

      const configPath = require.resolve('./fixtures/failing.conf.js');
      const { task, stdout } = protractorCommand({ configPath });

      try {
        await task();
      } catch (error) {
        expect(stdout()).toMatch(/1 spec, 1 failure/);
      }
    });
  });

  describe('unit', () => {
    jest.mock('execa');

    const execa = require('execa');
    const protractor = require('../src/index');

    beforeEach(() => {
      execa.mockReset();
    });

    it('should merge webdriver manager options with the default and transform to args', async () => {
      const webdriverManagerOptions = { gecko: 'true', standalone: true, 'versions.chrome': 2.29 };

      await protractor({ webdriverManagerOptions })();

      const expectedArgs = ['update', '--standalone', '--gecko', 'true', '--versions.chrome', '2.29'];
      const passedArgs = execa.mock.calls[0][1];

      expect(passedArgs).toEqual(expectedArgs);
    });

    it('should call node with correct flags when debug falg is on', async () => {
      const protractorOptions = { framework: 'mocha', debug: true, specs: 'e2e.test.js' };
      await protractor({ protractorOptions, configPath: 'foo/protractor.conf' })();

      const expectedArgs = ['--framework', 'mocha', '--debug', '--specs', 'e2e.test.js', 'foo/protractor.conf'];
      const passedArgs = execa.mock.calls[1][1];

      expect(passedArgs).toEqual(expectedArgs);
    });
  });
});
