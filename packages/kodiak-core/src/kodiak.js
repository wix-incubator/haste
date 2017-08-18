const path = require('path');
const cp = require('child_process');
const chalk = require('chalk');

const worker = path.resolve(__dirname, 'worker');

function format(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}

function delta(start) {
  const end = new Date();
  const time = end.getTime() - start.getTime();

  return [end, time];
}

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
