const elegantSpinner = require('elegant-spinner');
const chalk = require('chalk');

module.exports = class TaskLoader {
  constructor(name) {
    this.name = name;
    this.status = 'loading'; // 'succeed' | 'failed' | 'stopped' | 'loading'
    this.content = `${chalk.bold(name)}`;
    this.frame = elegantSpinner();
    this.error;
  }

  getContent() {
    if (this.status === 'loading') {
      return `${this.frame()} ${this.content}`;
    }

    return this.content;
  }

  success() {
    if (this.status !== 'loading') return;
    this.status = 'succeed';
    this.content = `${chalk.green('✔')} ${this.content}`;
  }

  failure(error) {
    if (this.status !== 'loading') return;
    this.status = 'failed';
    this.error = error;
    this.content = `${chalk.red('✖')} ${this.content}`;
  }

  getError() {
    return this.error ? this.error.stack : '';
  }

  stop() {
    if (this.status !== 'loading') return;
    this.status = 'stopped';
    this.content = ` ${this.content}`;
  }
};
