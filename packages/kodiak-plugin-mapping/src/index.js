module.exports = class MappingPlugin {
  constructor({ mapping }) {
    this.mapping = mapping;
  }

  apply(runner) {
    runner.plugin('finish', (digestedSequence) => {
      this.mapping(digestedSequence);
    });
  }
};
