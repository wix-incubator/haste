const chalk = require('chalk');

module.exports = class TaskLoader {
  constructor(name) {
    this.name = name;
    this.status = null; // 'succeed' | 'failed' | 'stopped'
    this.content = name;
  }

  getContent() {
    if (this.status) {
      return chalk.dim(`  ${this.content}`);
    }

    return chalk.dim(`    ${this.content}`);
  }

  success() {
    this.status = 'succeed';
    this.content = `✔ ${this.content}`;
  }

  failure() {
    this.status = 'failed';
    this.content = `${chalk.red('✖')} ${this.content}`;
  }

  stop() {
    this.status = 'stopped';
    this.content = `  ${this.content}`;
  }
};
