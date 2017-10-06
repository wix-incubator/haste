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

class TestPlugin {
  constructor(stdout) {
    this.stdout = stdout;
  }

  apply(runner) {
    runner.plugin('start-worker', (worker) => {
      worker.child.stdout.on('data', buffer => this.stdout(buffer.toString()));
    });
  }
}

describe('haste', () => {
  const stdout = jest.fn();

  afterEach(() => {
    process.removeAllListeners();
    stdout.mockClear();
  });

  describe('running tasks', () => {
    it('should run a successful task and resolve', () => {
      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        const result = await run({ task: successful });

        expect(result).toEqual(undefined);
        expect(stdout.mock.calls).toEqual([['successful-task\n']]);
      });
    });

    it('should run an unsuccessful task and reject', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        try {
          await run({ task: unsuccessful });
        } catch (error) {
          expect(error).toEqual('some-error');
          expect(stdout.mock.calls).toEqual([['unsuccessful-task\n'], ['some-error\n']]);
        }
      });
    });

    it('should run a sequence of two successful tasks and resolve', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        const result = await run(
          { task: successful },
          { task: successful }
        );

        expect(result).toEqual(undefined);
        expect(stdout.mock.calls).toEqual([['successful-task\n'], ['successful-task\n']]);
      });
    });

    it('should run a sequence of a successful task and an unsuccessful task and reject', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        try {
          await run(
            { task: successful },
            { task: unsuccessful }
          );
        } catch (error) {
          expect(error).toEqual('some-error');
          expect(stdout.mock.calls).toEqual([['successful-task\n'], ['unsuccessful-task\n'], ['some-error\n']]);
        }
      });
    });

    it('should run a sequence of an unsuccessful task and a successful task and reject', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        try {
          await run(
            { task: unsuccessful },
            { task: successful }
          );
        } catch (error) {
          expect(error).toEqual('some-error');
          expect(stdout.mock.calls).toEqual([['unsuccessful-task\n'], ['some-error\n']]);
        }
      });
    });

    it('should run a hard error task and reject', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        try {
          await run({ task: hardError });
        } catch (error) {
          expect(error.message).toEqual('some-error');
          expect(stdout.mock.calls).toContainEqual(['hard-error-task\n']);
        }
      });
    });

    it('should run a task that throws when it\'s required and reject', async () => {
      expect.assertions(1);

      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        try {
          await run({ task: requireError });
        } catch (error) {
          expect(error.message).toEqual('some-error');
        }
      });
    });

    it('should run a task that doesn\'t return a promise and reject', async () => {
      expect.assertions(1);

      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        try {
          await run({ task: noPromise });
        } catch (error) {
          expect(error.message).toEqual('Cannot read property \'then\' of undefined');
        }
      });
    });

    it('should run a successful task, return it\'s returned value and resolve', () => {
      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        const result = await run({ task: returnedValue });

        expect(result).toEqual('some-value');
        expect(stdout.mock.calls).toEqual([['returned-value-task\n']]);
      });
    });

    it('should run a sequence of tasks and pass each output as the following tasks\'s input', () => {
      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        const result = await run(
          { task: returnedValue },
          { task: loggingValue }
        );

        expect(result).toEqual('some-other-value');
        expect(stdout.mock.calls).toEqual([['returned-value-task\n'], ['logging-value-task\n'], ['some-value\n']]);
      });
    });

    it('should run a task with options and resolve', () => {
      const start = haste();

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        const result = await run({ task: loggingOptions, options: { value: 'some-value' } });

        expect(result).toEqual('some-value');
        expect(stdout.mock.calls).toEqual([['logging-options-task\n'], ['{ value: \'some-value\' }\n']]);
      });
    });
  });

  describe('run context', () => {
    it('should resolve a task relative to the run context', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        const result = await run({ task: './successful-task' });

        expect(result).toEqual(undefined);
        expect(stdout.mock.calls).toEqual([['successful-task\n']]);
      });
    });

    it('should resolve a task relative to the run context when a full module name supplied', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        const result = await run({ task: 'haste-task-successful' });

        expect(result).toEqual(undefined);
        expect(stdout.mock.calls).toEqual([['successful-task\n']]);
      });
    });

    it('should resolve a task relative to the run context when a partial module name supplied', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        const result = await run({ task: 'successful' });

        expect(result).toEqual(undefined);
        expect(stdout.mock.calls).toEqual([['successful-task\n']]);
      });
    });

    it('should resolve a task relative to the run context when a partial module name supplied', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        const { run } = configure({
          plugins: [new TestPlugin(stdout)]
        });

        const result = await run({ task: 'successful' });

        expect(result).toEqual(undefined);
        expect(stdout.mock.calls).toEqual([['successful-task\n']]);
      });
    });
  });
});
