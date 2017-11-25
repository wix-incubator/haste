module.exports = class TestPlugin {
  constructor() {
    this.stdout = '';
    this.stderr = '';
  }

  apply(runner) {
    runner.plugin('create-pool', (pool) => {
      pool.stdout.on('data', (data) => {
        this.stdout += data.toString();
      });

      pool.stderr.on('data', (data) => {
        this.stderr += data.toString();
      });
    });
  }
};
