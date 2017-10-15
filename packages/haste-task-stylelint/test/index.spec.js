const stylelint = require('../src');

const config = {
  rules: {
    'max-empty-lines': 0,
  },
};

describe('haste-stylelint', () => {
  it('should pass for valid css files', () => {
    const task = stylelint({ config });

    const file = {
      filename: require.resolve('./fixtures/valid.css'),
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual(undefined);
      });
  });

  it('should fail for files that fail validation', () => {
    expect.assertions(1);

    const task = stylelint({ config });

    const file = {
      filename: require.resolve('./fixtures/invalid.css'),
    };

    return task([file])
      .catch((errors) => {
        expect(errors).toMatch(/Expected no more than 0 empty lines/);
      });
  });

  it('should pass for valid scss files', () => {
    const task = stylelint({ config });

    const file = {
      filename: require.resolve('./fixtures/valid.scss'),
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual(undefined);
      });
  });

  it('should pass for valid less files', () => {
    const task = stylelint({ config });

    const file = {
      filename: require.resolve('./fixtures/valid.less'),
    };

    return task([file])
      .then((result) => {
        expect(result).toEqual(undefined);
      });
  });
});
