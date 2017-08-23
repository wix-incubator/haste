const Tapable = require('tapable');

module.exports = class extends Tapable {
  constructor({ module, options, context }) {
    super();

    this.module = module;
    this.options = options;
    this.context = context;
  }
};
