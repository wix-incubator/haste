const run = require('../../teskit');

const mocha = run(require.resolve('../src'));

describe('haste-mocha', () => {
  it('should run a passing test and resolve', () => {
    const task = mocha();

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    return task([file])
      .then(({ stdout }) => {
        expect(stdout()).toMatch(/1 passing/);
      });
  });

  it('should run a failing test and reject', () => {
    expect.assertions(1);

    const task = mocha();

    const file = {
      filename: require.resolve('./fixtures/fail'),
    };

    return task([file])
      .catch(({ stdout }) => {
        expect(stdout()).toMatch(/1 failing/);
      });
  });

  it('should pass configuration to mocha runner', () => {
    const task = mocha({ reporter: 'landing' });

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    return task([file])
      .then(({ stdout }) => {
        expect(stdout()).toMatch(/✈/);
      });
  });
});
