const fs = require('fs');
const path = require('path');
const retry = require('retry-promise').default;
const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const fromFixture = (filename) => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

describe('haste-task-webpack', () => {
  let test;

  afterEach(() => test.cleanup());

  describe('when configPath is a path to an object', () => {
    it('should bundle with webpack', async () => {
      test = await setup({
        'entry.js': fromFixture('./fixtures/entry.js'),
        'webpack.config.js': fromFixture('./fixtures/webpack.config.js'),
      });

      await test.run(async ({ [taskPath]: webpack }) => {
        await webpack({ configPath: test.files['webpack.config.js'].path });
      });

      expect(test.files['bundle.js'].exists).toBe(true);
    });

    it('should reject if webpack fails', async () => {
      expect.assertions(1);

      test = await setup({
        'entry.js': fromFixture('./fixtures/entry.js'),
        'webpack.config.invalid.js': fromFixture('./fixtures/webpack.config.invalid.js'),
      });

      await test.run(async ({ [taskPath]: webpack }) => {
        try {
          await webpack({ configPath: test.files['webpack.config.invalid.js'].path });
        } catch (error) {
          expect(error.message).toMatch('Invalid configuration object');
        }
      });
    });

    it('should support passing callback that accepts webpack err and stats', async () => {
      test = await setup({
        'entry.js': fromFixture('./fixtures/entry.js'),
        'webpack.config.js': fromFixture('./fixtures/webpack.config.js'),
      });

      await test.run(async ({ [taskPath]: webpack }) => {
        await webpack({
          configPath: test.files['webpack.config.js'].path,
          callbackPath: require.resolve('./fixtures/callback'),
        });
      });

      expect(test.files['bundle.js'].exists).toBe(true);
      expect(test.stdio.stdout).toMatch('1 module');
    });

    it('should reject if there are compilation errors', async () => {
      expect.assertions(1);

      test = await setup({
        'invalid-javascript.js': fromFixture('./fixtures/invalid-javascript.js'),
        'webpack.config.error.js': fromFixture('./fixtures/webpack.config.error.js'),
      });

      await test.run(async ({ [taskPath]: webpack }) => {
        try {
          await webpack({ configPath: test.files['webpack.config.error.js'].path });
        } catch (error) {
          expect(error.message).toMatch('Module not found');
        }
      });
    });
  });

  describe('when configPath is a path to a function', () => {
    it('should pass parameters argument to the function', async () => {
      test = await setup({
        'entry.js': fromFixture('./fixtures/entry.js'),
        'webpack.config.js': fromFixture('./fixtures/webpack.config.js'),
        'webpack.config.function.js': fromFixture('./fixtures/webpack.config.function.js'),
      });

      const configParams = {
        entry: test.files['entry.js'].path,
        output: {
          path: test.cwd,
          filename: 'bundle.js',
        },
      };

      await test.run(async ({ [taskPath]: webpack }) => {
        await webpack({
          configPath: test.files['webpack.config.function.js'].path,
          configParams,
        });
      });

      expect(test.files['bundle.js'].exists).toBe(true);
    });
  });

  describe('when watch mode is used', () => {
    it('should compile again when a change is detected', async () => {
      test = await setup({
        'entry.js': fromFixture('./fixtures/entry.js'),
        'webpack.config.js': fromFixture('./fixtures/webpack.config.js'),
      });

      await test.run(async ({ [taskPath]: webpack }) => {
        await webpack({
          configPath: test.files['webpack.config.js'].path,
          watch: true,
        });
      });

      expect(test.files['bundle.js'].content).toMatch('hello world');

      await test.files['entry.js'].write(fromFixture('./fixtures/modified-entry.js'));

      await retry(async () => {
        expect(test.files['bundle.js'].content).toMatch('foo bar');
      });
    });
  });

  describe('when statsFilename option is given', () => {
    it('should create a stats file', async () => {
      test = await setup({
        'entry.js': fromFixture('./fixtures/entry.js'),
        'webpack.config.js': fromFixture('./fixtures/webpack.config.js'),
      });

      await test.run(async ({ [taskPath]: webpack }) => {
        await webpack({
          configPath: test.files['webpack.config.js'].path,
          statsFilename: 'webpack-stats.json',
        });
      });

      expect(JSON.parse(test.files['webpack-stats.json'].content)).toMatchObject({
        errors: [],
        warnings: [],
        assets: [{
          name: 'bundle.js',
          chunks: [0],
        }],
        chunks: [{
          id: 0,
          modules: [{
            id: 0,
            name: './entry.js',
          }],
        }],
        modules: [{
          id: 0,
          name: './entry.js',
        }],
      });
    });
  });
});
