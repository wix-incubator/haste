const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { defaultStatsDir, defaultFilenamePattern } = require('./constants');
const { delta, parseFileNamePattern } = require('./utils');

module.exports = class StatsPlugin {
  constructor({
    base = process.cwd(),
    directory = defaultStatsDir,
    filename = defaultFilenamePattern
  } = {}) {
    this.base = base;
    this.directory = directory;
    this.filenamePattern = filename;
    this.name;
    this.persistent;
    this.start;
    this.end;
    this.status;
    this.error;
    this.delta;
    this.runs = [];
    this.tasks = [];
  }

  addDeltas() {
    this.delta = delta(this.start, this.end);

    this.runs = this.runs.map((run) => {
      run.delta = delta(run.start, run.end); // eslint-disable-line
      return run;
    });

    this.tasks = this.runs.map((task) => {
      task.delta = delta(task.start, task.end); // eslint-disable-line
      return task;
    });
  }

  statsObject() {
    return {
      name: this.name,
      persistent: this.persistent,
      start: this.start,
      end: this.end,
      delta: this.delta,
      status: this.status,
      runs: this.runs,
      tasks: this.tasks,
    };
  }

  preSave() {
    this.addDeltas();
  }

  save() {
    this.preSave();
    const statsDirPath = path.join(this.base, this.directory);
    const filename = parseFileNamePattern(this.filenamePattern, this.name);
    const statsFilePath = path.join(statsDirPath, filename);
    const currentSequence = this.statsObject();

    try {
      const sequences = JSON.parse(fs.readFileSync(statsFilePath));
      sequences.unshift(currentSequence);
      fs.writeFileSync(statsFilePath, JSON.stringify(sequences, null, 2));
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e;
      }

      mkdirp.sync(statsDirPath);
      fs.writeFileSync(statsFilePath, JSON.stringify([currentSequence], null, 2));
    }
  }

  apply(runner) {
    this.persistent = runner.persistent;

    runner.plugin('start', ({ name }) => {
      this.name = name;
      this.start = new Date();
    });

    runner.plugin('start-run', (runPhase) => {
      const startRun = new Date();
      const runName = runPhase.tasks.map(t => t.name).join(', ');

      runPhase.tasks.forEach((task) => {
        let startTask;

        task.plugin('start-task', () => {
          startTask = new Date();
        });

        task.plugin('succeed-task', () => {
          const endTask = new Date();

          const taskStats = {
            start: startTask,
            end: endTask,
            name: task.name,
            status: 'succeed',
          };

          this.tasks.push(taskStats);
        });

        task.plugin('failed-task', (error) => {
          const endTask = new Date();

          const taskStats = {
            start: startTask,
            end: endTask,
            name: task.name,
            error,
            status: 'failed'
          };

          this.tasks.push(taskStats);
        });
      });

      runPhase.plugin('succeed-run', () => {
        const endRun = new Date();

        const runStats = {
          start: startRun,
          end: endRun,
          name: runName,
          status: 'succeed'
        };

        this.runs.push(runStats);
      });

      runPhase.plugin('failed-run', (error) => {
        const endRun = new Date();

        const runStats = {
          start: startRun,
          end: endRun,
          error,
          name: runName,
          status: 'failed'
        };

        this.runs.push(runStats);
      });
    });

    runner.plugin('finish-success', () => {
      this.end = new Date();
      this.status = 'succeed';
      this.save();
    });

    runner.plugin('finish-failure', (error) => {
      this.end = new Date();
      this.error = error;
      this.status = 'failed';
      this.save();
    });
  }
};
