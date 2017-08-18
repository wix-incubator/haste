const task = require(process.argv[2]);

task()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
