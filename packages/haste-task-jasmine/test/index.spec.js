const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const passing = require.resolve('./fixtures/pass');
const failing = require.resolve('./fixtures/fail');
const reportersPath = require.resolve('./fixtures/reporters');
const requireModule = require.resolve('./fixtures/require-module');

describe('haste-jasmine', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should run a passing test and resolve', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: jasmine }) => {
      await jasmine({
        pattern: passing,
      });
    });

    expect(test.stdio.stdout).toMatch('1 spec, 0 failures');
  });

  it('should run a failing test and reject', async () => {
    expect.assertions(1);

    test = await setup();

    await test.run(async ({ [taskPath]: jasmine }) => {
      try {
        await jasmine({
          pattern: failing,
        });
      } catch (error) {
        expect(test.stdio.stdout).toMatch('1 spec, 1 failure');
      }
    });
  });

  it('should support passing a configuration object', async () => {
    test = await setup();

    const config = {
      helpers: [
        require.resolve('./fixtures/setup'),
      ],
    };

    await test.run(async ({ [taskPath]: jasmine }) => {
      await jasmine({
        pattern: passing,
        config,
      });
    });

    expect(test.stdio.stdout).toMatch('setup');
  });

  it('should support passing a path for repoters to use', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: jasmine }) => {
      await jasmine({
        pattern: passing,
        reportersPath,
      });
    });

    expect(test.stdio.stdout).toMatch('running suite with 1');
  });

  it('should clean require cache after a successful run', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: jasmine }) => {
      await jasmine({
        pattern: passing,
        reportersPath,
      });

      expect(test.stdio.stdout).toMatch('1 spec, 0 failures');

      await jasmine({
        pattern: passing,
        reportersPath,
      });

      expect(test.stdio.stdout).not.toMatch('No specs found');
    });
  });

  it('should clean require cache after a failing run', async () => {
    expect.assertions(2);

    test = await setup();

    await test.run(async ({ [taskPath]: jasmine }) => {
      try {
        await jasmine({
          pattern: failing,
          reportersPath: require.resolve('./fixtures/reporters'),
        });
      } catch (error) {
        expect(test.stdio.stdout).toMatch('1 spec, 1 failure');
      }

      try {
        await jasmine({
          pattern: [failing, passing],
          reportersPath: require.resolve('./fixtures/reporters'),
        });
      } catch (error) {
        expect(test.stdio.stdout).toMatch('2 specs, 1 failure');
      }
    });
  });

  it('should not clean require cache between runs for modules in node_modules', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: jasmine }) => {
      await jasmine({
        pattern: requireModule,
      });

      expect(test.stdio.stdout).toMatch('hey there');

      await jasmine({
        pattern: requireModule,
      });

      expect(test.stdio.stdout.match(/hey there/gi).length).toEqual(1);
    });
  });
});
