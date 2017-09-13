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

  function run(tasks) {
    const runner = kodiak([new TestPlugin(stdout)]);
    return runner.run(tasks);
  }

  afterEach(() => {
    stdout.mockClear();
  });

  it('should run a successful task and resolve', async () => {
    const result = await run([
      [
        { module: successful },
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
          { module: unsuccessful },
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
        { module: successful },
        { module: successful },
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
          { module: successful },
          { module: unsuccessful },
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
        { module: successful }
      ],
      [
        { module: successful },
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
          { module: successful },
        ],
        [
          { module: unsuccessful },
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
          { module: unsuccessful },
        ],
        [
          { module: successful },
        ]
      ]);
    } catch (errors) {
      expect(errors).toEqual(['some-error']);
      expect(stdout.mock.calls.length).toEqual(1);
      expect(stdout.mock.calls).toContainEqual(['unsuccessful-task\n']);
      expect(stdout.mock.calls).not.toContainEqual(['successful-task\n']);
    }
  });
});
