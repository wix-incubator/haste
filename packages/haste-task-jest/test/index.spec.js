const path = require('path');
const retry = require('retry-promise').default;
const { run } = require('haste-test-utils');

const { command, kill } = run(require.resolve('../src'));

describe('haste-jest', () => {
  afterEach(kill);

  it('should resolve for a passing test', async () => {
    const rootDir = path.resolve(__dirname, './fixtures/pass');

    const argv = {
      config: JSON.stringify({
        rootDir,
      })
    };

    const projects = [rootDir];

    const { task, stderr } = command({ argv, projects });

    return task()
      .then(() => {
        expect(stderr()).toMatch('1 passed');
      });
  });

  it('should reject for a failing test', async () => {
    expect.assertions(1);

    const rootDir = path.resolve(__dirname, './fixtures/fail');

    const argv = {
      config: JSON.stringify({
        rootDir,
      })
    };

    const projects = [rootDir];

    const { task, stderr } = command({ argv, projects });

    return task()
      .catch(() => {
        expect(stderr()).toMatch('1 failed');
      });
  });

  it('should resolve if there are no tests', async () => {
    const rootDir = path.resolve(__dirname, './fixtures/empty');

    const argv = {
      config: JSON.stringify({
        rootDir,
      })
    };

    const projects = [rootDir];

    const { task, stdout } = command({ argv, projects });

    return task()
      .then(() => {
        expect(stdout()).toMatch('No tests found');
      });
  });

  describe('when watch mode is used', () => {
    it('should resolve immediately after a successful run', async () => {
      const rootDir = path.resolve(__dirname, './fixtures/pass');

      const argv = {
        config: JSON.stringify({
          rootDir,
        }),
        watchAll: true
      };

      const projects = [rootDir];

      const { task, stderr } = command({ argv, projects });

      await task();

      await retry(async () => {
        expect(stderr()).toContain('1 passed');
      });
    });

    it('should resolve immediately after a failed run', async () => {
      const rootDir = path.resolve(__dirname, './fixtures/fail');

      const argv = {
        config: JSON.stringify({
          rootDir,
        }),
        watchAll: true
      };

      const projects = [rootDir];

      const { task, stderr } = command({ argv, projects });

      await task();

      await retry(async () => {
        expect(stderr()).toContain('1 failed');
      });
    });
  });
});
