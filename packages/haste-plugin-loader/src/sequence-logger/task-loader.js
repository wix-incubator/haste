const chalk = require('chalk');

module.exports = class TaskLoader {
  constructor(name) {
    this.name = name;
    this.done = false;
    this.content = name;
  }

  getContent() {
    if (this.done) {
      return chalk.dim(`  ${this.content}`);
    }

    return chalk.dim(`    ${this.content}`);
  }

  success() {
    this.done = true;
    this.content = `${chalk.green('✔')} ${this.content}`;
  }

  failure() {
    this.done = true;
    this.content = `${chalk.red('✖')} ${this.content}`;
  }
};
