const path = require('path');
const { run } = require('haste-test-utils');

const { command: jasmine, kill } = run(require.resolve('../src'));

describe('haste-jasmine', () => {
  afterEach(kill);

  it('should run a passing test and resolve', () => {
    const { task, stdout } = jasmine();

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    return task([file])
      .then(() => {
        expect(stdout()).toMatch('1 spec, 0 failures');
      });
  });

  it('should run a failing test and reject', () => {
    expect.assertions(1);

    const { task, stdout } = jasmine();

    const file = {
      filename: require.resolve('./fixtures/fail'),
    };

    return task([file])
      .catch(() => {
        expect(stdout()).toMatch('1 spec, 1 failure');
      });
  });

  it('should support passing a configuration object', () => {
    const config = {
      helpers: [
        require.resolve('./fixtures/setup')
      ]
    };
    const { task, stdout } = jasmine({ config });

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    return task([file])
      .then(() => {
        expect(stdout()).toMatch('setup');
      });
  });

  it('should support passing a path for repoters to use', () => {
    const { task, stdout } = jasmine({
      reportersPath: require.resolve('./fixtures/reporters')
    });

    const file = {
      filename: require.resolve('./fixtures/pass'),
    };

    return task([file])
      .then(() => {
        expect(stdout()).toMatch('running suite with 1');
      });
  });

  it('should run a passing test with a relative path and a cwd', () => {
    const { task, stdout } = jasmine();

    const file = {
      filename: 'pass',
      cwd: path.join(__dirname, 'fixtures'),
    };

    return task([file])
      .then(() => {
        expect(stdout()).toMatch('1 spec, 0 failures');
      });
  });
});
