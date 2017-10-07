const eslint = require('../src');

describe('haste-eslint', () => {
  it('should pass for valid files', () => {
    const task = eslint();

    const file = {
      filename: require.resolve('./fixtures/valid.js'),
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual(undefined);
      });
  });

  it('should fail for invalid files', () => {
    expect.assertions(1);

    const task = eslint({ rules: { 'no-console': 'error' } });

    const file = {
      filename: require.resolve('./fixtures/valid.js'),
    };

    return task([file])
      .catch((result) => {
        expect(result).toMatch(/Unexpected console statement/);
      });
  });
});
