const path = require('path');
const { run } = require('haste-test-utils');

const { command, kill } = run(require.resolve('../src'));

describe('haste-jest', () => {
  afterEach(kill);

  it('should resolve for a passing test', async () => {
    const rootDir = path.resolve(__dirname, './fixtures/pass');

    const config = {
      rootDir,
    };

    const projects = [rootDir];

    const { task, stderr } = command({ config, projects });

    return task()
      .then(() => {
        expect(stderr()).toMatch('1 passed');
      });
  });

  it('should reject for a failing test', async () => {
    expect.assertions(1);

    const rootDir = path.resolve(__dirname, './fixtures/fail');

    const config = {
      rootDir,
    };

    const projects = [rootDir];

    const { task, stderr } = command({ config, projects });

    return task()
      .catch(() => {
        expect(stderr()).toMatch('1 failed');
      });
  });

  it('should resolve if there are no tests', async () => {
    const rootDir = path.resolve(__dirname, './fixtures/empty');

    const config = {
      rootDir,
    };

    const projects = [rootDir];

    const { task, stdout } = command({ config, projects });

    return task()
      .then(() => {
        expect(stdout()).toMatch('No tests found');
      });
  });
});
