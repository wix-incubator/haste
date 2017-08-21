const Tapable = require('tapable');

module.exports = class extends Tapable {
  constructor({ module, args }) {
    super();

    this.module = module;
    this.args = args;
  }
};
