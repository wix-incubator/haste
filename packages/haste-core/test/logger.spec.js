const { createRunner } = require('../src');

describe('logger', () => {
  it('should use the logger that supplied on the runner creation', async () => {
    const spy = jest.fn();

    class MockLogger {
      apply(runner) {
        runner.hooks.beforeExecution.tap('logger', spy);
      }
    }

    const mockLogger = new MockLogger();
    const runner = createRunner({ logger: mockLogger });
    const command = runner.command(async () => {});

    await command();

    expect(spy).toBeCalled();
  });

  it('should use the default logger if there is no logger configured', async () => {
    const { hooks } = createRunner();
    const [firstHook] = hooks.beforeExecution.taps;

    expect(firstHook.name).toBe('logger');
  });
});
