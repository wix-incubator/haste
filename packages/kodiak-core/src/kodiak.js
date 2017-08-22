const Runner = require('./runner');

function kodiak(context, plugins) {
  const runner = new Runner(context);

  runner.apply(...plugins);

  return runner;
}

module.exports = kodiak;
