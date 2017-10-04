const elegantSpinner = require('elegant-spinner');
const chalk = require('chalk');
const TaskLoader = require('./task-loader');

module.exports = class RunPhaseLoader {
  constructor(name, tasksLength) {
    this.tasksLength = tasksLength;
    this.name = name;
    this.status = null; // 'succeed' | 'failed' | 'stopped'
    this.content = `${chalk.bold(name)}`;
    this.frame = elegantSpinner();
    this.tasks = [];
    this.error;
  }

  startTask(name) {
    const loaderTask = new TaskLoader(name);
    this.tasks.push(loaderTask);
    return loaderTask;
  }

  getContent() {
    if (this.status) {
      return this.content;
    }

    return `${this.frame()} ${this.content}`;
  }

  getCurrentRunningTask() {
    if (this.status === 'succeed') {
      return '';
    }

    return this.tasks[this.tasks.length - 1].getContent();
  }

  getTasksContent() {
    if (this.tasks.length === 0) {
      return '';
    }

    const blankSpaces = new Array(this.tasksLength - this.tasks.length).fill('\n');
    return `\n${this.tasks.map(t => t.getContent()).join('\n')}${blankSpaces.join('')}`;
  }

  success() {
    if (this.status) return;
    this.status = 'succeed';
    this.content = `${chalk.green('✔')} ${this.content}`;
  }

  failure(error) {
    if (this.status) return;
    this.status = 'failed';
    this.error = error;
    this.content = `${chalk.red('✖')} ${this.content}`;
  }

  getError() {
    return this.error ? this.error.stack : '';
  }

  stop() {
    if (this.status) return;
    this.status = 'stopped';
    this.content = ` ${this.content}`;
  }
};
