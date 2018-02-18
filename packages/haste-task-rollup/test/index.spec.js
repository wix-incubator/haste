const fs = require('fs');
const path = require('path');
const { setup } = require('haste-test-utils');

const fromFixture = (filename) => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

const taskPath = require.resolve('../src');

describe('haste-task-rollup', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should bundle with rollup', async () => {
    test = await setup({
      'entry.js': fromFixture('./fixtures/entry.js'),
      'rollup.config.js': fromFixture('./fixtures/rollup.config.js'),
    });

    await test.run(async ({ [taskPath]: rollup }) => {
      await rollup({ configPath: test.files['rollup.config.js'].path });
    });

    expect(test.files['bundle.js'].exists).toBe(true);
  });

  it('should bundle with rollup and config as function', async () => {
    test = await setup({
      'entry.js': fromFixture('./fixtures/entry.js'),
      'rollup.config.js': fromFixture('./fixtures/rollup.config.function.js'),
    });

    await test.run(async ({ [taskPath]: rollup }) => {
      await rollup({
        configPath: test.files['rollup.config.js'].path,
        configParams: { entry: test.files['entry.js'].path },
      });
    });

    expect(test.files['bundle.js'].exists).toBe(true);
  });

  it('should bundle with rollup and configs as array', async () => {
    test = await setup({
      'entry.js': fromFixture('./fixtures/entry.js'),
      'rollup.config.js': fromFixture('./fixtures/rollup.config.array.js'),
    });

    await test.run(async ({ [taskPath]: rollup }) => {
      await rollup({ configPath: test.files['rollup.config.js'].path });
    });

    expect(test.files['bundle1.js'].exists).toBe(true);
    expect(test.files['bundle2.js'].exists).toBe(true);
  });

  it('should reject if rollup fails', async () => {
    expect.assertions(1);

    test = await setup({
      'entry.js': fromFixture('./fixtures/entry.js'),
      'rollup.config.invalid.js': fromFixture('./fixtures/rollup.config.invalid.js'),
    });

    await test.run(async ({ [taskPath]: rollup }) => {
      try {
        await rollup({ configPath: test.files['rollup.config.invalid.js'].path });
      } catch (error) {
        expect(error.message).toMatch('Error in worker: You must supply options.input to rollup');
      }
    });
  });

  it('should reject if there are compilation errors', async () => {
    expect.assertions(1);

    test = await setup({
      'invalid-javascript.js': fromFixture('./fixtures/invalid-javascript.js'),
      'rollup.config.error.js': fromFixture('./fixtures/rollup.config.error.js'),
    });

    await test.run(async ({ [taskPath]: rollup }) => {
      try {
        await rollup({ configPath: test.files['rollup.config.error.js'].path });
      } catch (error) {
        expect(error.message).toMatch('Error in worker: Could not resolve \'./not-existing\' from invalid-javascript.js');
      }
    });
  });
});
