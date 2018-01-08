module.exports = class TestPlugin {
  constructor() {
    this.stdout = '';
    this.stderr = '';
    this.pools = [];
  }

  cleanup() {
    this.pools.forEach(pool => pool.kill());
    this.pools = [];
  }

  apply(runner) {
    runner.hooks.beforeExecution.tapPromise('track stdio', async (execution) => {
      execution.hooks.createTask.tap('track task', (task) => {
        this.pools.push(task.pool);

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
