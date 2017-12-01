const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const pathToValidFile = require.resolve('./fixtures/valid.ts');
const pathToInvalidFile = require.resolve('./fixtures/invalid.ts');
const pathToConfiguration = require.resolve('./fixtures/tslint.json');

describe('haste-tslint', () => {
  it('should resolve for valid files', async () => {
    const { run } = await setup();

    await run(async ({ [taskPath]: tslint }) => {
      await tslint({
        pattern: pathToValidFile,
        configurationFilePath: pathToConfiguration,
      });
    });
  });

  it('should reject for valid files', async () => {
    expect.assertions(1);

    const { run } = await setup();

    await run(async ({ [taskPath]: tslint }) => {
      try {
        await tslint({
          pattern: pathToInvalidFile,
          configurationFilePath: pathToConfiguration,
        });
      } catch (error) {
        expect(error.message).toMatch('Calls to \'console.error\' are not allowed');
      }
    });
  });

  it('should reject if a tslint.json could not be found', async () => {
    expect.assertions(1);

    const { run } = await setup();

    await run(async ({ [taskPath]: tslint }) => {
      try {
        await tslint({
          pattern: pathToValidFile,
          configurationFilePath: 'no-file',
        });
      } catch (error) {
        expect(error.message).toMatch('Could not find config file');
      }
    });
  });

  it('should pass configuration to the linter', async () => {
    expect.assertions(1);

    const { run } = await setup();

    await run(async ({ [taskPath]: tslint }) => {
      try {
        await tslint({
          pattern: pathToInvalidFile,
          configurationFilePath: pathToConfiguration,
          options: { formatter: 'verbose' },
        });
      } catch (error) {
        expect(error.message).toMatch('ERROR: (no-console)');
      }
    });
  });
});
