const Kodiak = require('kodiak-core');

module.exports = (tasks, plugins, context) => {
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
