const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const pathToValidFile = require.resolve('./fixtures/valid.ts');
const pathToInvalidFile = require.resolve('./fixtures/invalid.ts');
const pathToTslintFile = require.resolve('./fixtures/tslint.json');
const pathToValidTsconfigFile = require.resolve('./fixtures/tsconfig.json');
const pathToInvalidTsconfigFile = require.resolve('./fixtures/invalidTsconfig.json');

describe('haste-tslint', () => {
  let test;

  it('should resolve for valid files', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: tslint }) => {
      await tslint({
        tsconfigFilePath: pathToValidTsconfigFile,
        tslintFilePath: pathToTslintFile
      });
    });
  });

  it('should reject for invalid files', async () => {
    expect.assertions(1);

    test = await setup();

    await test.run(async ({ [taskPath]: tslint }) => {
      try {
        await tslint({
          tsconfigFilePath: pathToInvalidTsconfigFile,
          tslintFilePath: pathToTslintFile,
        });
      } catch (error) {
        expect(error.message).toMatch('Calls to \'console.error\' are not allowed');
      }
    });
  });

  it('should reject if a tslint.json could not be found', async () => {
    expect.assertions(1);

    test = await setup();

    await test.run(async ({ [taskPath]: tslint }) => {
      try {
        await tslint({
          tsconfigFilePath: pathToValidTsconfigFile,
          tslintFilePath: 'no-file',
        });
      } catch (error) {
        expect(error.message).toMatch('Could not find config file');
      }
    });
  });

  it('should reject if a tslint.json was not provided', async () => {
    expect.assertions(1);

    test = await setup();

    await test.run(async ({ [taskPath]: tslint }) => {
      try {
        await tslint({
          tsconfigFilePath: pathToValidTsconfigFile,
        });
      } catch (error) {
        expect(error.message).toMatch('Could not find config file');
      }
    });
  });

  it('should pass configuration to the linter', async () => {
    expect.assertions(1);

    test = await setup();

    await test.run(async ({ [taskPath]: tslint }) => {
      try {
        await tslint({
          tsconfigFilePath: pathToInvalidTsconfigFile,
          tslintFilePath: pathToTslintFile,
          options: { formatter: 'verbose' },
        });
      } catch (error) {
        expect(error.message).toMatch('ERROR: (no-console)');
      }
    });
  });
});
