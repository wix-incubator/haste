const path = require('path');
const haste = require('../src/haste');

const successful = require.resolve('./fixtures/successful-task');
const unsuccessful = require.resolve('./fixtures/unsuccessful-task');
const hardError = require.resolve('./fixtures/hard-error-task');
const requireError = require.resolve('./fixtures/require-error-task');
const noPromise = require.resolve('./fixtures/no-promise-task');
const returnedValue = require.resolve('./fixtures/returned-value-task');
const loggingValue = require.resolve('./fixtures/logging-value-task');
const loggingOptions = require.resolve('./fixtures/logging-options-task');
const noError = require.resolve('./fixtures/no-error-task');

describe('haste', () => {
  let runner;
  let testPlugin;
  let stdout = '';
  const runPhase = jest.fn();

  class TestPlugin {
    apply(runnerTapable) {
      runnerTapable.plugin('start-worker', (worker) => {
        worker.child.stdout.on('data', (buffer) => {
          stdout += buffer.toString();
        });
      });

      runnerTapable.plugin('start-run', runPhase);
    }
  }

  beforeEach(() => {
    testPlugin = new TestPlugin();
  });

  afterEach(() => {
    process.removeAllListeners();
    runner.close();
    stdout = '';
    runPhase.mockClear();
  });

  describe('running tasks', () => {
    it('should run a successful task and resolve', () => {
      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const result = await runner.run({ task: successful });

        expect(result).toEqual(undefined);
        expect(stdout).toMatch('successful-task\n');
      });
    });

    it('should run an unsuccessful task and reject', async () => {
      expect.assertions(3);

      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        try {
          await runner.run({ task: unsuccessful });
        } catch (error) {
          expect(error).toEqual('some-error');
          expect(stdout).toMatch('unsuccessful-task\n');
          expect(stdout).toMatch('some-error\n');
        }
      });
    });

    it('should run a sequence of two successful tasks and resolve', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const result = await runner.run(
          { task: successful },
          { task: successful }
        );

        expect(result).toEqual(undefined);
        expect(stdout).toMatch('successful-task\nsuccessful-task\n');
      });
    });

    it('should run a sequence of a successful task and an unsuccessful task and reject', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        try {
          await runner.run(
            { task: successful },
            { task: unsuccessful }
          );
        } catch (error) {
          expect(error).toEqual('some-error');
          expect(stdout).toMatch('successful-task\nunsuccessful-task\nsome-error\n');
        }
      });
    });

    it('should run a sequence of an unsuccessful task and a successful task and reject', async () => {
      expect.assertions(3);

      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        try {
          await runner.run(
            { task: unsuccessful },
            { task: successful }
          );
        } catch (error) {
          expect(error).toEqual('some-error');
          expect(stdout).toMatch('unsuccessful-task\n');
          expect(stdout).toMatch('some-error\n');
        }
      });
    });

    it('should run a hard error task and reject', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        try {
          await runner.run({ task: hardError });
        } catch (error) {
          expect(error.message).toEqual('some-error');
          expect(stdout).toMatch('hard-error-task\n');
        }
      });
    });

    it('should run a task that throws when it\'s required and reject', async () => {
      expect.assertions(1);

      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        try {
          await runner.run({ task: requireError });
        } catch (error) {
          expect(error.message).toEqual('some-error');
        }
      });
    });

    it('should run a task that doesn\'t return a promise and reject', async () => {
      expect.assertions(1);

      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        try {
          await runner.run({ task: noPromise });
        } catch (error) {
          expect(error.message).toEqual('Cannot read property \'then\' of undefined');
        }
      });
    });

    it('should run a task that rejects without an error value and reject', async () => {
      expect.assertions(1);

      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        try {
          await runner.run({ task: noError });
        } catch (error) {
          expect(error).toEqual(undefined);
        }
      });
    });

    it('should run a successful task, return it\'s returned value and resolve', () => {
      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const result = await runner.run({ task: returnedValue });

        expect(result).toEqual('some-value');
        expect(stdout).toMatch('returned-value-task\n');
      });
    });

    it('should run a sequence of tasks and pass each output as the following tasks\'s input', () => {
      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const result = await runner.run(
          { task: returnedValue },
          { task: loggingValue }
        );

        expect(result).toEqual('some-other-value');
        expect(stdout).toEqual('returned-value-task\nlogging-value-task\nsome-value\n');
      });
    });

    it('should run a task with options and resolve', () => {
      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const result = await runner.run({ task: loggingOptions, options: { value: 'some-value' } });

        expect(result).toEqual('some-value');
        expect(stdout).toEqual('logging-options-task\n{ value: \'some-value\' }\n');
      });
    });

    it('should run a task with metadata object and pass it to plugins', () => {
      const start = haste();
      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const result = await runner.run({ task: successful, metadata: { title: 'awesome-task' } });
        expect(result).toEqual(undefined);

        const firstRunPhase = runPhase.mock.calls[0][0];
        expect(firstRunPhase.tasks[0].metadata).toEqual({ title: 'awesome-task' });
      });
    });
  });

  describe('run context', () => {
    it('should resolve a task relative to the run context', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const result = await runner.run({ task: './successful-task' });

        expect(result).toEqual(undefined);
        expect(stdout).toMatch('successful-task\n');
      });
    });

    it('should resolve a task relative to the run context when a full module name supplied', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const result = await runner.run({ task: 'haste-task-successful' });

        expect(result).toEqual(undefined);
        expect(stdout).toMatch('successful-task\n');
      });
    });

    it('should resolve a task relative to the run context when a partial module name supplied', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const result = await runner.run({ task: 'successful' });

        expect(result).toEqual(undefined);
        expect(stdout).toEqual('successful-task\n');
      });
    });
  });

  describe('function notation', () => {
    it('should be supported for running tasks', async () => {
      const start = haste();

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const options = { value: 'some-value' };
        const result = await runner.run(runner.tasks[loggingOptions](options));

        expect(result).toEqual('some-value');
        expect(stdout).toEqual('logging-options-task\n{ value: \'some-value\' }\n');
      });
    });

    it('should convert camelcase to dashes', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        runner = configure({
          plugins: [testPlugin]
        });

        const options = { value: 'some-value' };
        const result = await runner.run(runner.tasks.successfulCamelCase(options));

        expect(result).toEqual('some-value');
        expect(stdout).toEqual('successful-camel-case-task\n{ value: \'some-value\' }\n');
      });
    });
  });
});
