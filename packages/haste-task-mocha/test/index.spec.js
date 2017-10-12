const { run } = require('haste-test-utils');

const mocha = run(require.resolve('../src'));

describe('haste-mocha', () => {
  it('should run a passing test and resolve', () => {
    const { task, stdout } = mocha();

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    return task([file])
      .then(() => {
        expect(stdout()).toMatch(/1 passing/);
      });
  });

  it('should run a failing test and reject', () => {
    expect.assertions(1);

    const { task, stdout } = mocha();

    const file = {
      filename: require.resolve('./fixtures/fail'),
    };

    return task([file])
      .catch(() => {
        expect(stdout()).toMatch(/1 failing/);
      });
  });

  it('should pass configuration to mocha runner', () => {
    const { task, stdout } = mocha({ reporter: 'landing' });

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    return task([file])
      .then(() => {
        expect(stdout()).toMatch(/✈/);
      });
  });
});
