const logUpdate = require('log-update');
const RunPhaseLoader = require('./run-phase-loader');
const { delta } = require('../utils');
const chalk = require('chalk');

module.exports = class SequenceLoader {
  constructor({ oneLinerTasks, frameRate }) {
    this.startTime = new Date();
    this.runs = [];
    this.interval;
    this.oneLinerTasks = oneLinerTasks;
    this.frameRate = frameRate || 100;
    this.watch = false;
  }

  startRun(name, tasksLength) {
    if (!this.interval) {
      this.render();
    }

    const runPhaseLoader = new RunPhaseLoader(name, tasksLength);
    this.watch ? this.runs = [runPhaseLoader] : this.runs.push(runPhaseLoader);
    return runPhaseLoader;
  }

  renderFrame() {
    return this.runs.map((run) => {
      const tasksContent = this.oneLinerTasks ?
        run.getCurrentRunningTask() :
        run.getTasksContent();

      return run.getContent() + tasksContent;
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

  stop() {
    const currentFrame = this.renderFrame();
    logUpdate(`${currentFrame}\n${this.generateDoneMessage()}`);
    clearInterval(this.interval);
    this.runs = [];
  }

  watchMode() {
    this.stop();
    logUpdate();
    console.log('\x1Bc');
    console.log('watching files ...\n\n');
    this.watch = true;
    this.render();
  }
};

