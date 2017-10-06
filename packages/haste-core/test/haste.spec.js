const path = require('path');
const haste = require('../src/haste');

const successful = require.resolve('./fixtures/successful-task');
const unsuccessful = require.resolve('./fixtures/unsuccessful-task');

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
    stdout.mockClear();
  });

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
      } catch (errors) {
        expect(errors).toEqual('some-error');
        expect(stdout.mock.calls).toEqual([['unsuccessful-task\n'], ['some-error\n']]);
      }
    });
  });

  it('should run a successful task followed by an unsuccessful task in sequence and reject', async () => {
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
      } catch (errors) {
        expect(errors).toEqual('some-error');
        expect(stdout.mock.calls).toEqual([['successful-task\n'], ['unsuccessful-task\n'], ['some-error\n']]);
      }
    });
  });

  it('should run an unsuccessful task, not run the following successful task and reject', async () => {
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
      } catch (errors) {
        expect(errors).toEqual('some-error');
        expect(stdout.mock.calls).toEqual([['unsuccessful-task\n'], ['some-error\n']]);
      }
    });
  });

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
});
