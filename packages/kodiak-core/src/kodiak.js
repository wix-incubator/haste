const path = require('path');
const cp = require('child_process');
const chalk = require('chalk');
const { format, delta } = require('./utils');

const worker = path.resolve(__dirname, 'worker');

const run = (task) => {
  const taskname = path.basename(task);

  const child = cp.fork(worker, [], {});

  child.send({
    task,
  });

  const start = new Date();
  console.log(`[${format(start)}] ${chalk.black.bgGreen('Starting')} '${taskname}'...`);

  child.on('message', (data) => {
    if (data.success) {
      const [end, time] = delta(start);
      console.log(`[${format(end)}] ${chalk.black.bgCyan('Finished')} '${taskname}' after ${time} ms`);
    } else {
      const [end, time] = delta(start);
      console.log(`[${format(end)}] ${chalk.white.bgRed('Failed')} '${taskname}' after ${time} ms`);
    }
  });
};

const tasks = [
  'some-task',
  'other-task',
].map(task => path.resolve(__dirname, task));

tasks.forEach(run);
