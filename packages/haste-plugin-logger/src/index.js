const chalk = require('chalk');
const { format, delta, generateRunTitle } = require('./utils');

module.exports = class LoggerPlugin {
  apply(runner) {
    const keys = ['stdout', 'stderr'];

    keys.forEach(key => process[key].setMaxListeners(100));

    runner.plugin('start-worker', (worker) => {
      keys.forEach(key => worker.child[key].pipe(process[key]));
    });

    runner.plugin('start-run', (runPhase) => {
      const runTitle = generateRunTitle(runPhase.tasks);

      const start = new Date();
      console.log(`[${format(start)}] ${chalk.black.bgGreen('Starting')} '${runTitle}'...`);

      runPhase.plugin('succeed-run', () => {
        const [end, time] = delta(start);
        console.log(`[${format(end)}] ${chalk.black.bgCyan('Finished')} '${runTitle}' after ${time} ms`);
      });

      runPhase.plugin('failed-run', () => {
        const [end, time] = delta(start);
        console.log(`[${format(end)}] ${chalk.white.bgRed('Failed')} '${runTitle}' after ${time} ms`);
      });
    });
  }
};
