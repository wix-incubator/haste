const { run } = require('haste-test-utils');

const { command: karma, kill } = run(require.resolve('../src'));

jest.setTimeout(30000);

describe('haste-karma', () => {
  afterEach(kill);

  it('should run a passing test and resolve', () => {
    const { task, stdout } = karma({
      configFile: require.resolve('./fixtures/karma.conf.pass.js')
    });

    return task()
      .then(() => {
        expect(stdout()).toMatch('Executed 1 of 1 SUCCESS');
      });
  });

  it('should run a failing test and reject', () => {
    expect.assertions(1);

    const { task, stdout } = karma({
      configFile: require.resolve('./fixtures/karma.conf.fail.js')
    });

    return task()
      .catch(() => {
        expect(stdout()).toMatch('Executed 1 of 1 (1 FAILED)');
      });
  });
});
