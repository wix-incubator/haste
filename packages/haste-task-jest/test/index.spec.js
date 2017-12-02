const path = require('path');
const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const passing = path.resolve(__dirname, './fixtures/pass');
const failing = path.resolve(__dirname, './fixtures/fail');
const empty = path.resolve(__dirname, './fixtures/empty');

describe('haste-jest', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should resolve for a passing test', async () => {
    test = await setup();

    const config = {
      rootDir: passing,
    };

    const projects = [passing];

    await test.run(async ({ [taskPath]: jest }) => {
      await jest({
        config,
        projects,
      });
    });

    expect(test.stdio.stderr).toMatch('1 passed');
  });

  it('should reject for a failing test', async () => {
    expect.assertions(2);

    test = await setup();

    const config = {
      rootDir: failing,
    };

    const projects = [failing];

    await test.run(async ({ [taskPath]: jest }) => {
      try {
        await jest({
          config,
          projects,
        });
      } catch (error) {
        expect(error.message).toMatch('Jest failed with 1 failing tests');
        expect(test.stdio.stderr).toMatch('1 failed');
      }
    });
  });

  it('should resolve if there are no tests', async () => {
    test = await setup();

    const config = {
      rootDir: empty,
    };

    const projects = [empty];

    await test.run(async ({ [taskPath]: jest }) => {
      try {
        await jest({
          config,
          projects,
        });
      } catch (error) {
        expect(test.stdio.stdout).toMatch('No tests found');
      }
    });
  });
});
