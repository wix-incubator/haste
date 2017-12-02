const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const passing = require.resolve('./fixtures/karma.conf.pass.js');
const failing = require.resolve('./fixtures/karma.conf.fail.js');
const watching = require.resolve('./fixtures/karma.conf.watch.js');

jest.setTimeout(10000);

describe('haste-karma', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should run a passing test and resolve', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: karma }) => {
      await karma({
        configFile: passing,
      });
    });

    expect(test.stdio.stdout).toMatch('Executed 1 of 1 SUCCESS');
  });

  it.only('should run a failing test and reject', async () => {
    expect.assertions(2);

    test = await setup();

    await test.run(async ({ [taskPath]: karma }) => {
      try {
        await karma({
          configFile: failing,
        });
      } catch (error) {
        expect(error.message).toMatch('Karma failed with code 1');
        expect(test.stdio.stdout).toMatch('Executed 1 of 1 (1 FAILED)');
      }
    });
  });

  it('should resolve after first run if watch options are passed', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: karma }) => {
      await karma({
        configFile: watching,
      });
    });

    expect(test.stdio.stdout).toMatch('Executed 1 of 1 SUCCESS');
  });
});
