// @flow
const Kodiak = require('kodiak');

type Tasks = { task: string, options: Object }[][];

module.exports = (tasks: Tasks, plugins: string[], context: string) => {
  const runner = Kodiak(context, plugins);

  runner.run(tasks)
    .then((errors) => {
      if (errors.length) {
        errors.filter(Boolean).map(console.error);
        process.exit(1);
      }

      process.exit(0);
    });
};
