module.exports = class ExtendPlugin {
  constructor({ before, after, plugins }) {
    this.before = before;
    this.after = after;
    this.plugins = plugins;
  }

  apply(runner) {
    runner.plugin('start', () => {
      runner.apply(...this.plugins);

      this.before({
        define: (...args) => runner.define(...args),
        watch: (...args) => runner.watch(...args),
      });
    });

    runner.plugin('finish-success', () => {
      this.after({
        define: (...args) => runner.define(...args),
        watch: (...args) => runner.watch(...args),
      });
    });
  }
};
