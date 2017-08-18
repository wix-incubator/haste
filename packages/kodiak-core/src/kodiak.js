const path = require('path');
const cp = require('child_process');
const { range } = require('ramda');
const chalk = require('chalk');
// const Queue = require('./queue');
const { queue } = require('async');
const { format, delta } = require('./utils');

const worker = path.resolve(__dirname, 'worker');

process.on('unhandledRejection', p => console.log(p));

function createThreads(size) {
  return range(0, size).map(() => cp.fork(worker));
}

function roundRobinThreadPool(threads) {
  let lastThreadId = 0;

  return () => {
    const threadId = lastThreadId;

    lastThreadId += 1;

    if (lastThreadId >= threads.length) {
      lastThreadId = 0;
    }

    return threads[threadId];
  };
}

module.exports = ({ size }) => {
  const threads = createThreads(size);
  const getThread = roundRobinThreadPool(threads);

  const pool = queue((task, callback) => {
    const child = getThread();

    const start = new Date();
    const taskname = path.basename(task);

    console.log(`[${format(start)}] ${chalk.black.bgGreen('Starting')} '${taskname}'...`);

    const result = new Promise((resolve, reject) =>
      child.on('message', data =>
        data.success ? resolve() : reject(data.error)
      )
    );

    child.send({ task });

    return result
      .then(() => {
        const [end, time] = delta(start);
        console.log(`[${format(end)}] ${chalk.black.bgCyan('Finished')} '${taskname}' after ${time} ms`);
        callback();
      })
      .catch(() => {
        const [end, time] = delta(start);
        console.log(`[${format(end)}] ${chalk.white.bgRed('Failed')} '${taskname}' after ${time} ms`);
        callback();
      });
  }, size);

  return {
    run: task => Promise.resolve()
      .then(() => pool.push(task))
  };
};
