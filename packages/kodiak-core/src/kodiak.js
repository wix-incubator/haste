const path = require('path');
const { fork } = require('child_process');

const forkP = (modulePath, args, options) => new Promise((resolve, reject) => {
  const child = fork(modulePath, args, options);
  child.on('exit', code => code === 0 ? resolve() : reject());
});

const worker = path.resolve(__dirname, 'channel');

const run = (task) => {
  const basename = path.basename(task);

  console.log(`starting ${basename}`);

  return forkP(worker, [task], {})
    .then(() => console.log(`finished ${basename}`))
    .catch(() => console.log(`failed ${basename}`));
};

const tasks = [
  'some-task',
  'other-task',
].map(task => path.resolve(__dirname, task));

tasks.forEach(run);
