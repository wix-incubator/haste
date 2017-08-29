const Tapable = require('tapable');

module.exports = class extends Tapable {
  constructor({ module, options, child }) {
    super();

    this.module = module;
    this.options = options;
    this.child = child;
  }
};
