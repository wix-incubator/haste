const path = require('path');
const { run } = require('haste-test-utils');

const { command: jasmine, kill } = run(require.resolve('../src'));

describe('haste-jasmine', () => {
  afterEach(kill);

  it('should run a passing test and resolve', async () => {
    const { task, stdout } = jasmine();

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    await task([file]);
    expect(stdout()).toMatch('1 spec, 0 failures');
  });

  it('should run a failing test and reject', async () => {
    expect.assertions(1);

    const { task, stdout } = jasmine();

    const file = {
      filename: require.resolve('./fixtures/fail'),
    };

    try {
      await task([file]);
    } catch (error) {
      expect(stdout()).toMatch('1 spec, 1 failure');
    }
  });

  it('should support passing a configuration object', async () => {
    const config = {
      helpers: [
        require.resolve('./fixtures/setup')
      ]
    };
    const { task, stdout } = jasmine({ config });

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    await task([file]);
    expect(stdout()).toMatch('setup');
  });

  it('should support passing a path for repoters to use', async () => {
    const { task, stdout } = jasmine({
      reportersPath: require.resolve('./fixtures/reporters')
    });

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    await task([file]);
    expect(stdout()).toMatch('running suite with 1');
  });

  it('should run a passing test with a relative path and a cwd', async () => {
    const { task, stdout } = jasmine();

    const file = {
      filename: 'pass',
      cwd: path.join(__dirname, 'fixtures'),
    };

    await task([file]);
    expect(stdout()).toMatch('1 spec, 0 failures');
  });

  it('should clean require cache between runs', async () => {
    const { task, stdout } = jasmine();

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    await task([file]);
    expect(stdout()).toMatch('1 spec, 0 failures');

    await task([file]);
    expect(stdout()).not.toMatch('No specs found');
  });

  it('should not clean require cache between runs for modules in node_modules', async () => {
    const { task, stdout } = jasmine();

    const file = {
      filename: require.resolve('./fixtures/require-module'),
    };

    await task([file]);
    expect(stdout()).toMatch('hey there');

    await task([file]);
    expect(stdout().match(/hey there/gi).length).toEqual(1);
  });
});
