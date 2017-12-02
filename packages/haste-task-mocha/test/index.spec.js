const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const passing = require.resolve('./fixtures/pass');
const failing = require.resolve('./fixtures/fail');
const requireFile = require.resolve('./fixtures/setup');
const requireModule = require.resolve('./fixtures/require-module');

describe('haste-mocha', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should run a passing test and resolve', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: mocha }) => {
      await mocha({
        pattern: passing,
      });
    });

    expect(test.stdio.stdout).toMatch('1 passing');
  });

  it('should run a failing test and reject', async () => {
    expect.assertions(2);

    test = await setup();

    await test.run(async ({ [taskPath]: mocha }) => {
      try {
        await mocha({
          pattern: failing,
        });
      } catch (error) {
        expect(error.message).toMatch('Mocha failed with 1 failing tests');
        expect(test.stdio.stdout).toMatch('1 failing');
      }
    });
  });

  it('should pass configuration to mocha runner', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: mocha }) => {
      await mocha({
        pattern: passing,
        reporter: 'landing',
      });
    });

    expect(test.stdio.stdout).toMatch('✈');
  });

  it('should support requiring files before mocha starts running', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: mocha }) => {
      await mocha({
        pattern: passing,
        requireFiles: [requireFile],
      });
    });

    expect(test.stdio.stdout).toMatch('setup');
  });

  it('should clean require cache after a successful run', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: mocha }) => {
      await mocha({
        pattern: passing,
      });

      expect(test.stdio.stdout).toMatch('1 passing');

      await mocha({
        pattern: passing,
      });

      expect(test.stdio.stdout).not.toMatch('0 passing');
    });
  });

  it('should clean require cache after a failing run', async () => {
    expect.assertions(3);

    test = await setup();

    await test.run(async ({ [taskPath]: mocha }) => {
      try {
        await mocha({
          pattern: failing,
        });
      } catch (error) {
        expect(test.stdio.stdout).toMatch('1 failing');
      }

      try {
        await mocha({
          pattern: [failing, passing],
        });
      } catch (error) {
        expect(test.stdio.stdout).toMatch('1 passing');
        expect(test.stdio.stdout).toMatch('1 failing');
      }
    });
  });

  it('should not clean require cache between runs for modules in node_modules', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: mocha }) => {
      await mocha({
        pattern: requireModule,
      });

      expect(test.stdio.stdout).toMatch('hey there');

      await mocha({
        pattern: requireModule,
      });

      expect(test.stdio.stdout.match(/hey there/gi).length).toEqual(1);
    });
  });
});
