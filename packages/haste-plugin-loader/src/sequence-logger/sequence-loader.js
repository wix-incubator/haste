const logUpdate = require('log-update');
const TaskLoader = require('./task-loader');
const { delta } = require('../utils');
const chalk = require('chalk');

module.exports = class SequenceLoader {
  constructor({ frameRate = 100 }) {
    this.startTime = new Date();
    this.tasks = [];
    this.interval;
    this.frameRate = frameRate;
    this.watch = false;
  }

  startTask(name, tasksLength) {
    const taskLoader = new TaskLoader(name, tasksLength);
    this.watch ? this.tasks = [taskLoader] : this.tasks.push(taskLoader);
    return taskLoader;
  }

  renderFrame() {
    // const getRunError = run => this.watch ? `\n\n${run.getError()}` : '';

    return this.tasks.map((task) => {
      return task.getContent();
    }).join('\n');
  }

  render() {
    console.log(chalk.bold('starting haste runner 🏃'));

    this.interval = setInterval(() => {
      logUpdate(this.renderFrame());
    }, this.frameRate);
  }

  generateDoneMessage() {
    const deltaTime = parseFloat(delta(this.startTime)[1] / 1000).toFixed(2);
    return `💫  Done in ${deltaTime}s.`;
  }

  done() {
    const currentFrame = this.renderFrame();
    logUpdate(`${currentFrame}\n${this.generateDoneMessage()}`);
    clearInterval(this.interval);
    this.tasks = [];
  }

  stopAllTasks() {
    this.tasks.forEach(task => task.stop());
  }

  exitOnError(error) {
    this.stopAllTasks();
    const currentFrame = this.renderFrame();
    logUpdate(`${currentFrame}\n`);
    clearInterval(this.interval);
    this.tasks = [];
    if (error) {
      console.log(error.stack || error);
    }
  }

  exitAndClear() {
    logUpdate();
    clearInterval(this.interval);
    this.tasks = [];
  }

  watchMode() {
    this.done();
    logUpdate();
    console.log('\x1Bc');
    console.log('watching files ...\n\n');
    this.watch = true;
    this.render();
  }
};

