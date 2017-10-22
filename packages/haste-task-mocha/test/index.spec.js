const { run } = require('haste-test-utils');

const { command: mocha, kill } = run(require.resolve('../src'));

describe('haste-mocha', () => {
  afterEach(kill);

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

  it('should support requiring files before mocha starts running', () => {
    const { task, stdout } = mocha({
      requireFiles: [require.resolve('./fixtures/setup')]
    });

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    return task([file])
      .then(() => {
        expect(stdout()).toMatch(/setup/);
      });
  });
});
