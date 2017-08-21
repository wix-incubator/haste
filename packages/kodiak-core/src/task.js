const Tapable = require('tapable');

module.exports = class extends Tapable {
  constructor({ module, options }) {
    super();

    this.module = module;
    this.options = options;
  }
};
