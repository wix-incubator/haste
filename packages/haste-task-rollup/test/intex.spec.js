const fs = require('fs');
const path = require('path');
const { setup } = require('haste-test-utils');

const fromFixture = (filename) => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

const taskPath = require.resolve('../src');

describe('haste-task-rollup', () => {
  it('should bundle with rollup', async () => {
    const test = await setup({
      'entry.js': fromFixture('./fixtures/entry.js'),
      'rollup.config.js': fromFixture('./fixtures/rollup.config.js'),
    });

    await test.run(async ({ [taskPath]: rollup }) => {
      await rollup({ configPath: test.files['rollup.config.js'].path });
    });

    expect(test.files['bundle.js'].exists).toBe(true);

    test.cleanup();
  });

  it('should bundle with rollup and config as function', async () => {
    const test = await setup({
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

    test.cleanup();
  });

  it('should bundle with rollup and configs as array', async () => {
    const test = await setup({
      'entry.js': fromFixture('./fixtures/entry.js'),
      'rollup.config.js': fromFixture('./fixtures/rollup.config.array.js'),
    });

    await test.run(async ({ [taskPath]: rollup }) => {
      await rollup({ configPath: test.files['rollup.config.js'].path });
    });

    expect(test.files['bundle1.js'].exists).toBe(true);
    expect(test.files['bundle2.js'].exists).toBe(true);

    test.cleanup();
  });
});
