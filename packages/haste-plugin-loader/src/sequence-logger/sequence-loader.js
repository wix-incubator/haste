const logUpdate = require('log-update');
const RunPhaseLoader = require('./run-phase-loader');

module.exports = class SequenceLoader {
  constructor({ oneLinerTasks, frameRate }) {
    this.runs = [];
    this.interval;
    this.oneLinerTasks = oneLinerTasks;
    this.frameRate = frameRate || 100;
  }

  startRun(name, tasksLength) {
    if (!this.interval) {
      this.render();
    }

    const loaderRun = new RunPhaseLoader(name, tasksLength);
    this.runs.push(loaderRun);
    return loaderRun;
  }

  renderFrame() {
    logUpdate(this.runs.map((run) => {
      const tasksContent = this.oneLinerTasks ?
        run.getCurrentRunningTask() :
        run.getTasksContent();

      return run.getContent() + tasksContent;
    }).join('\n'));
  }

  render() {
    this.interval = setInterval(() => {
      this.renderFrame();
    }, this.frameRate);
  }

  stop() {
    this.renderFrame();
    clearInterval(this.interval);
  }
};

