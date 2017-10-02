const Tapable = require('tapable');

module.exports = class RunPhase extends Tapable {
  constructor(tasks) {
    super();
    this.tasks = tasks;
  }
};
