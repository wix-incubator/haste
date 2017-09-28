const path = require('path');
const haste = require('../src/haste');

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

describe('haste', () => {
  const stdout = jest.fn();

  function run(tasks, options = {}) {
    const runner = haste(Object.assign(options, {
      plugins: [new TestPlugin(stdout)]
    }));

    return runner.run(tasks);
  }

  afterEach(() => {
    stdout.mockClear();
  });

  it('should run a successful task and resolve', async () => {
    const sequence = [
      [
        { name: successful },
      ]
    ];

    const result = await run(sequence);

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n']]);
  });

  it('should run an unsuccessful task and reject', async () => {
    expect.assertions(2);

    const sequence = [
      [
        { name: unsuccessful },
      ]
    ];

    try {
      await run(sequence);
    } catch (errors) {
      expect(errors).toEqual(['some-error']);
      expect(stdout.mock.calls).toEqual([['unsuccessful-task\n']]);
    }
  });

  it('should run multiple successful tasks in parallel and resolve', async () => {
    const sequence = [
      [
        { name: successful },
        { name: successful },
      ]
    ];

    const result = await run(sequence);

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n'], ['successful-task\n']]);
  });

  it('should run a successful and an unsucessful tasks in parallel and reject', async () => {
    expect.assertions(4);

    const sequence = [
      [
        { name: successful },
        { name: unsuccessful },
      ]
    ];

    try {
      await run(sequence);
    } catch (errors) {
      expect(errors).toEqual(['some-error']);
      expect(stdout.mock.calls.length).toEqual(2);
      expect(stdout.mock.calls).toContainEqual(['unsuccessful-task\n']);
      expect(stdout.mock.calls).toContainEqual(['successful-task\n']);
    }
  });

  it('should run multiple successful tasks in sequence and resolve', async () => {
    const sequence = [
      [
        { name: successful }
      ],
      [
        { name: successful },
      ]
    ];

    const result = await run(sequence);

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n'], ['successful-task\n']]);
  });

  it('should run a successful task followed by an unsuccessful task in sequence and reject', async () => {
    expect.assertions(4);

    const sequence = [
      [
        { name: successful },
      ],
      [
        { name: unsuccessful },
      ]
    ];

    try {
      await run(sequence);
    } catch (errors) {
      expect(errors).toEqual(['some-error']);
      expect(stdout.mock.calls.length).toEqual(2);
      expect(stdout.mock.calls).toContainEqual(['unsuccessful-task\n']);
      expect(stdout.mock.calls).toContainEqual(['successful-task\n']);
    }
  });

  it('should run an unsuccessful task, not run the following successful task and reject', async () => {
    expect.assertions(4);

    const sequence = [
      [
        { name: unsuccessful },
      ],
      [
        { name: successful },
      ]
    ];

    try {
      await run(sequence);
    } catch (errors) {
      expect(errors).toEqual(['some-error']);
      expect(stdout.mock.calls.length).toEqual(1);
      expect(stdout.mock.calls).toContainEqual(['unsuccessful-task\n']);
      expect(stdout.mock.calls).not.toContainEqual(['successful-task\n']);
    }
  });

  it('should resolve a task relative to the run context', async () => {
    const sequence = [
      [
        { name: './successful-task' },
      ]
    ];

    const options = {
      context: path.join(__dirname, './fixtures'),
    };

    const result = await run(sequence, options);

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n']]);
  });

  it('should resolve a task relative to the run context when a full module name supplied', async () => {
    const sequence = [
      [
        { name: 'haste-task-successful' },
      ]
    ];

    const options = {
      context: path.join(__dirname, './fixtures'),
    };

    const result = await run(sequence, options);

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n']]);
  });

  it('should resolve a task relative to the run context when a partial module name supplied', async () => {
    const sequence = [
      [
        { name: 'successful' },
      ]
    ];

    const options = {
      context: path.join(__dirname, './fixtures'),
    };

    const result = await run(sequence, options);

    expect(result).toEqual(undefined);
    expect(stdout.mock.calls).toEqual([['successful-task\n']]);
  });
});
