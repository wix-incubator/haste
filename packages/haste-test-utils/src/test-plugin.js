module.exports = class TestPlugin {
  constructor() {
    this.stdout = '';
    this.stderr = '';
  }

  apply(runner) {
    runner.hooks.beforeExecution.tapPromise('track stdio', async (execution) => {
      execution.hooks.createTask.tap('track task', (task) => {
        task.pool.stdout.on('data', (data) => {
          this.stdout += data.toString();
        });

        task.pool.stderr.on('data', (data) => {
          this.stderr += data.toString();
        });
      });
    });
  }
};
