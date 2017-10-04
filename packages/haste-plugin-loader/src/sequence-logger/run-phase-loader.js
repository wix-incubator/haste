const elegantSpinner = require('elegant-spinner');
const chalk = require('chalk');
const TaskLoader = require('./task-loader');

module.exports = class RunPhaseLoader {
  constructor(name, tasksLength) {
    this.tasksLength = tasksLength;
    this.name = name;
    this.done = false;
    this.content = `${chalk.bold(name)}`;
    this.frame = elegantSpinner();
    this.tasks = [];
  }

  startTask(name) {
    const loaderTask = new TaskLoader(name);
    this.tasks.push(loaderTask);
    return loaderTask;
  }

  getContent() {
    if (this.done) {
      return this.content;
    }

    return `${this.frame()} ${this.content}`;
  }

  getCurrentRunningTask() {
    if (this.done) {
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
    this.done = true;
    this.content = `${chalk.green('✔')} ${this.content}`;
  }

  failure() {
    this.done = true;
    this.content = `${chalk.red('✖')} ${this.content}`;
  }
};
