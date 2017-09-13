const path = require('path');
const kodiak = require('../src/kodiak');

const successful = require.resolve('./fixtures/successful-task');
const unsuccessful = require.resolve('./fixtures/unsuccessful-task');

class TestPlugin {
  constructor(stdout) {
    this.stdout = stdout;
  }

  apply(runner) {
    runner.plugin('start-task', (task) => {
      task.child.stdout.on('data', buffer => this.stdout(buffer.toString()));
    });
  }
}

describe('kodiak', () => {
  const stdout = jest.fn();

  function run(tasks, options = {}) {
    const runner = kodiak(Object.assign(options, {
      plugins: [new TestPlugin(stdout)]
    }));

    return runner.run(tasks);
  }

  afterEach(() => {
    stdout.mockClear();
  });

  it('should run a successful task and resolve', async () => {
    const result = await run([
      [
        { name: successful },
      ]
    ]);

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n']]);
  });

  it('should run an unsuccessful task and reject', async () => {
    expect.assertions(2);

    try {
      await run([
        [
          { name: unsuccessful },
        ]
      ]);
    } catch (errors) {
      expect(errors).toEqual(['some-error']);
      expect(stdout.mock.calls).toEqual([['unsuccessful-task\n']]);
    }
  });

  it('should run multiple successful tasks in parallel and resolve', async () => {
    const result = await run([
      [
        { name: successful },
        { name: successful },
      ]
    ]);

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n'], ['successful-task\n']]);
  });

  it('should run a successful and an unsucessful tasks in parallel and reject', async () => {
    expect.assertions(4);

    try {
      await run([
        [
          { name: successful },
          { name: unsuccessful },
        ]
      ]);
    } catch (errors) {
      expect(errors).toEqual(['some-error']);
      expect(stdout.mock.calls.length).toEqual(2);
      expect(stdout.mock.calls).toContainEqual(['unsuccessful-task\n']);
      expect(stdout.mock.calls).toContainEqual(['successful-task\n']);
    }
  });

  it('should run multiple successful tasks in sequence and resolve', async () => {
    const result = await run([
      [
        { name: successful }
      ],
      [
        { name: successful },
      ]
    ]);

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n'], ['successful-task\n']]);
  });

  it('should run a successful task followed by an unsuccessful task in sequence and reject', async () => {
    expect.assertions(4);

    try {
      await run([
        [
          { name: successful },
        ],
        [
          { name: unsuccessful },
        ]
      ]);
    } catch (errors) {
      expect(errors).toEqual(['some-error']);
      expect(stdout.mock.calls.length).toEqual(2);
      expect(stdout.mock.calls).toContainEqual(['unsuccessful-task\n']);
      expect(stdout.mock.calls).toContainEqual(['successful-task\n']);
    }
  });

  it('should run an unsuccessful task, not run the following successful task and reject', async () => {
    expect.assertions(4);

    try {
      await run([
        [
          { name: unsuccessful },
        ],
        [
          { name: successful },
        ]
      ]);
    } catch (errors) {
      expect(errors).toEqual(['some-error']);
      expect(stdout.mock.calls.length).toEqual(1);
      expect(stdout.mock.calls).toContainEqual(['unsuccessful-task\n']);
      expect(stdout.mock.calls).not.toContainEqual(['successful-task\n']);
    }
  });

  it('should resolve a task relative to the run context', async () => {
    const result = await run([
      [
        { name: './successful-task' },
      ]
    ], { context: path.join(__dirname, './fixtures') });

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n']]);
  });

  it('should resolve a task relative to the run context when a full module name supplied', async () => {
    const result = await run([
      [
        { name: 'kodiak-task-successful' },
      ]
    ], { context: path.join(__dirname, './fixtures') });

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n']]);
  });

  it('should resolve a task relative to the run context when a partial module name supplied', async () => {
    const result = await run([
      [
        { name: 'successful' },
      ]
    ], { context: path.join(__dirname, './fixtures') });

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n']]);
  });
});
