const Runner = require('./runner');

function kodiak(plugins) {
  const runner = new Runner();

  runner.apply(...plugins);

  return runner;
}

module.exports = kodiak;
