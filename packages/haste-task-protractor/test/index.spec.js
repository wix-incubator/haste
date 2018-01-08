const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');
const passingConfigPath = require.resolve('./fixtures/passing.conf.js');
const failingConfigPath = require.resolve('./fixtures/failing.conf.js');

jest.setTimeout(30000);

describe.skip('haste-protractor', () => {
  describe('e2e', () => {
    let test;

    afterEach(() => test.cleanup());

    it('should run protractor with a passing test and resolve', async () => {
      test = await setup();

      await test.run(async ({ [taskPath]: protractor }) => {
        await protractor({ configPath: passingConfigPath });
      });

      expect(test.stdio.stdout).toMatch('1 spec, 0 failures');
    });

    it('should run protractor with a failing test and reject', async () => {
      expect.assertions(1);

      test = await setup();

      await test.run(async ({ [taskPath]: protractor }) => {
        try {
          await protractor({ configPath: failingConfigPath });
        } catch (error) {
          expect(test.stdio.stdout).toMatch('1 spec, 1 failure');
        }
      });
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

      await protractor({ webdriverManagerOptions });

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
