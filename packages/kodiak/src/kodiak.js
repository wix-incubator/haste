const Runner = require('./runner');

function kodiak({ plugins = [], context = __dirname, title } = {}) {
  const runner = new Runner({ context, title });

  runner.apply(...plugins);

  return runner;
}

module.exports = kodiak;
