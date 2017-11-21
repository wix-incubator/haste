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
  let api;
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
    api.close();
    stdout = '';
    runPhase.mockClear();
  });

  describe('running tasks', () => {
    it('should run a successful task and resolve', () => {
      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        const result = await api.run({ task: successful });

        expect(result.value).toEqual(undefined);
        expect(stdout).toMatch('successful-task\n');
      });
    });

    it('should run an unsuccessful task and reject', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        try {
          await api.run({ task: unsuccessful });
        } catch ({ error }) {
          expect(error).toEqual('some-error');
          expect(stdout).toMatch(['unsuccessful-task\n', 'some-error\n'].join(''));
        }
      });
    });

    it('should run an unsuccessful task with persistent=true and not reject', async () => {
      const start = haste();

      return start(async (configure) => {
        api = configure({
          persistent: true,
          plugins: [testPlugin]
        });

        return api.run({ task: unsuccessful });
      });
    });

    it('should run a sequence of two successful tasks and resolve', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        const result = await api.run(
          { task: successful },
          { task: successful }
        );

        expect(result.value).toEqual(undefined);
        expect(stdout).toMatch(['successful-task\n', 'successful-task\n'].join(''));
      });
    });

    it('should run a sequence of a successful task and an unsuccessful task and reject', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        try {
          await api.run(
            { task: successful },
            { task: unsuccessful }
          );
        } catch ({ error }) {
          expect(error).toEqual('some-error');
          expect(stdout).toMatch(['successful-task\n', 'unsuccessful-task\n', 'some-error\n'].join(''));
        }
      });
    });

    it('should run a sequence of an unsuccessful task and a successful task and reject', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        try {
          await api.run(
            { task: unsuccessful },
            { task: successful }
          );
        } catch ({ error }) {
          expect(error).toEqual('some-error');
          expect(stdout).toMatch(['unsuccessful-task\n', 'some-error\n'].join(''));
        }
      });
    });

    it('should run a hard error task and reject', async () => {
      expect.assertions(2);

      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        try {
          await api.run({ task: hardError });
        } catch ({ error }) {
          expect(error.message).toEqual('some-error');
          expect(stdout).toMatch('hard-error-task\n');
        }
      });
    });

    it('should run a task that throws when it\'s required and reject', async () => {
      expect.assertions(1);

      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        try {
          await api.run({ task: requireError });
        } catch ({ error }) {
          expect(error.message).toEqual('some-error');
        }
      });
    });

    it('should run a task that doesn\'t return a promise and reject', async () => {
      expect.assertions(1);

      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        try {
          await api.run({ task: noPromise });
        } catch ({ error }) {
          expect(error.message).toEqual('Cannot read property \'then\' of undefined');
        }
      });
    });

    it('should run a task that rejects without an error value and reject', async () => {
      expect.assertions(1);

      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        try {
          await api.run({ task: noError });
        } catch ({ error }) {
          expect(error).toEqual(undefined);
        }
      });
    });

    it('should run a successful task, return it\'s returned value and resolve', () => {
      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        const result = await api.run({ task: returnedValue });

        expect(result[0].value).toEqual('some-value');
        expect(stdout).toMatch('returned-value-task\n');
      });
    });

    it('should run a sequence of tasks and pass each output as the following tasks\'s input', () => {
      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        const result = await api.run(
          { task: returnedValue },
          { task: loggingValue }
        );


        expect(result[1].value).toEqual('some-other-value');
        expect(stdout).toEqual(['returned-value-task\n', 'logging-value-task\n', 'some-value\n'].join(''));
      });
    });

    it('should run a task with options and resolve', () => {
      const start = haste();

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        const result = await api.run({ task: loggingOptions, options: { value: 'some-value' } });

        expect(result[0].value).toEqual('some-value');
        expect(stdout).toEqual(['logging-options-task\n', '{ value: \'some-value\' }\n'].join(''));
      });
    });

    it('should run a task with metadata object and pass it to plugins', () => {
      const start = haste();
      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        const result = await api.run({ task: successful, metadata: { title: 'awesome-task' } });
        expect(result.value).toEqual(undefined);

        const firstRunPhase = runPhase.mock.calls[0][0];
        expect(firstRunPhase.tasks[0].metadata).toEqual({ title: 'awesome-task' });
      });
    });

    it('should pass persistent property when configured in preset', async () => {
      const start = haste();

      const runner = await start(async (configure) => {
        api = configure({ persistent: true });
      });

      expect(runner.persistent).toBe(true);
    });

    it('should pass idle property that is true when initial run is done on persistent mode', async () => {
      const start = haste();

      const runner = await start(async (configure) => {
        api = configure({ persistent: true });
      });

      expect(runner.idle).toBe(true);
    });
  });

  describe('run context', () => {
    it('should resolve a task relative to the run context', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        const result = await api.run({ task: './successful-task' });

        expect(result.value).toEqual(undefined);
        expect(stdout).toMatch('successful-task\n');
      });
    });

    it('should resolve a task relative to the run context when a full module name supplied', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        const result = await api.run({ task: 'haste-task-successful' });

        expect(result.value).toEqual(undefined);
        expect(stdout).toMatch('successful-task\n');
      });
    });

    it('should resolve a task relative to the run context when a partial module name supplied', async () => {
      const start = haste(path.join(__dirname, '/fixtures'));

      return start(async (configure) => {
        api = configure({
          plugins: [testPlugin]
        });

        const result = await api.run({ task: 'successful' });

        expect(result.value).toEqual(undefined);
        expect(stdout).toEqual('successful-task\n');
      });
    });
  });

  describe('function notation', () => {
    it('should return a task object which can be inserted into api.run() calls', async () => {
      const start = haste();

      return start(async (configure) => {
        const { tasks } = configure({
          plugins: [testPlugin]
        });

        const options = { value: 'some-value' };
        const resultTaskObject = { task: loggingOptions, options };

        expect(tasks[loggingOptions](options)).toEqual(resultTaskObject);
      });
    });

    it('should use the second argument of the function notation as a the metadata object of the task object', async () => {
      const start = haste();

      return start(async (configure) => {
        const { tasks } = configure({
          plugins: [testPlugin]
        });

        const options = { value: 'some-value' };
        const metadata = { title: 'awesome-task' };

        const resultTaskObject = { task: loggingOptions, options, metadata };

        expect(tasks[loggingOptions](options, metadata)).toEqual(resultTaskObject);
      });
    });

    it('should convert camelcase to dashes for non path task names', async () => {
      const start = haste();

      return start(async (configure) => {
        const { tasks } = configure({
          plugins: [testPlugin]
        });

        const options = { value: 'some-value' };
        const resultTaskObject = { task: 'camel-case-task', options };

        expect(tasks.camelCaseTask(options)).toEqual(resultTaskObject);
      });
    });
  });
});
