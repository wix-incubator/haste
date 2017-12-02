const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const options = {
  config: {
    rules: {
      'max-empty-lines': 0,
    },
  },
};

describe('haste-stylelint', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should pass for valid css files', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: stylelint }) => {
      await stylelint({
        pattern: require.resolve('./fixtures/valid.css'),
        options,
      });
    });
  });

  it('should fail for files that fail validation', async () => {
    expect.assertions(1);

    test = await setup();

    await test.run(async ({ [taskPath]: stylelint }) => {
      try {
        await stylelint({
          pattern: require.resolve('./fixtures/invalid.css'),
          options,
        });
      } catch (error) {
        expect(error.message).toMatch('Expected no more than 0 empty lines');
      }
    });
  });

  it('should pass for valid scss files', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: stylelint }) => {
      await stylelint({
        pattern: require.resolve('./fixtures/valid.scss'),
        options,
      });
    });
  });

  it('should pass for valid less files', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: stylelint }) => {
      await stylelint({
        pattern: require.resolve('./fixtures/valid.less'),
        options,
      });
    });
  });
});
