const Tapable = require('tapable');

module.exports = class extends Tapable {
  constructor({ name, modulePath, options, child }) {
    super();

    this.name = name;
    this.modulePath = modulePath;
    this.options = options;
    this.child = child;
  }
};
