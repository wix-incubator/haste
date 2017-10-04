const Tapable = require('tapable');

module.exports = class extends Tapable {
  constructor({ worker, options }) {
    super();

    this.worker = worker;
    this.options = options;
  }

  get name() {
    return this.worker.name;
  }

  run(input) {
    return this.worker.run(this.options, input);
  }
};
