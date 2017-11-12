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

  it('should clean require cache after a successful run', async () => {
    const { task, stdout } = mocha();

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    await task([file]);
    expect(stdout()).toMatch('1 passing');

    await task([file]);
    expect(stdout()).not.toMatch('0 passing');
  });

  it('should clean require cache after a failing run', async () => {
    expect.assertions(3);

    const { task, stdout } = mocha();

    const passing = {
      filename: require.resolve('./fixtures/pass'),
    };

    const failing = {
      filename: require.resolve('./fixtures/fail'),
    };

    try {
      await task([failing]);
    } catch (error) {
      expect(stdout()).toMatch('1 failing');
    }

    try {
      await task([failing, passing]);
    } catch (error) {
      expect(stdout()).toMatch('1 passing');
      expect(stdout()).toMatch('1 failing');
    }
  });

  it('should not clean require cache between runs for modules in node_modules', async () => {
    const { task, stdout } = mocha();

    const file = {
      filename: require.resolve('./fixtures/require-module'),
    };

    await task([file]);
    expect(stdout()).toMatch('hey there');

    await task([file]);
    expect(stdout().match(/hey there/gi).length).toEqual(1);
  });
});
