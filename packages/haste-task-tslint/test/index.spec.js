const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const pathToTslintFile = require.resolve('./fixtures/tslint.json');
const pathToValidTsconfigFile = require.resolve('./fixtures/tsconfig.json');
const pathToInvalidTsconfigFile = require.resolve('./fixtures/tsconfig-invalid.json');
const pathToValidFile = require.resolve('./fixtures/valid.ts');
const pathToInvalidFile = require.resolve('./fixtures/invalid.ts');

describe('haste-tslint', () => {
  let test;

  describe('linter', () => {
    it('should resolve for valid files when given tsconfigFilePath', async () => {
      test = await setup();

      await test.run(async ({ [taskPath]: tslint }) => {
        await tslint({
          tsconfigFilePath: pathToValidTsconfigFile,
          tslintFilePath: pathToTslintFile,
        });
      });
    });

    it('should reject for invalid files when given tsconfigFilePath', async () => {
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

    it('should resolve for valid files when pattern is given', async () => {
      test = await setup();

      await test.run(async ({ [taskPath]: tslint }) => {
        await tslint({
          pattern: pathToValidFile,
          tslintFilePath: pathToTslintFile,
        });
      });
    });

    it('should reject for invalid files when pattern is given', async () => {
      expect.assertions(1);

      test = await setup();

      await test.run(async ({ [taskPath]: tslint }) => {
        try {
          await tslint({
            pattern: pathToInvalidFile,
            tslintFilePath: pathToTslintFile,
          });
        } catch (error) {
          expect(error.message).toMatch('Calls to \'console.error\' are not allowed');
        }
      });
    });

    it('should use the tsconfig file when both pattern and tsConfigFilePath are provided', async () => {
      test = await setup();

      await test.run(async ({ [taskPath]: tslint }) => {
        await tslint({
          tsconfigFilePath: pathToValidTsconfigFile,
          pattern: pathToInvalidFile,
          tslintFilePath: pathToTslintFile,
        });
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

  describe('tslintFilePath', () => {
    const errorMessage = 'Could not find config file';

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
          expect(error.message).toMatch(errorMessage);
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
          expect(error.message).toMatch(errorMessage);
        }
      });
    });
  });

  describe('tsConfigFilePath', () => {
    it('should reject if a tsconfig.json could not be found', async () => {
      const errorMessage = 'The specified path does not exist';

      expect.assertions(1);

      test = await setup();

      await test.run(async ({ [taskPath]: tslint }) => {
        try {
          await tslint({
            tsconfigFilePath: 'no-file',
            tslintFilePath: pathToTslintFile,
          });
        } catch (error) {
          expect(error.message).toMatch(errorMessage);
        }
      });
    });

    it('should reject if both tsConfigFilePath and pattern were not provided', async () => {
      const errorMessage = 'haste-task-tslint requires a pattern or a tsconfigFilePath';

      expect.assertions(1);

      test = await setup();

      await test.run(async ({ [taskPath]: tslint }) => {
        try {
          await tslint({
            tslintFilePath: pathToTslintFile,
          });
        } catch (error) {
          expect(error.message).toContain(errorMessage);
        }
      });
    });
  });
});
