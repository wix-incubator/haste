// @flow
const Runner = require('./runner');

function kodiak(context: string, plugins: Array<string>) {
  const runner = new Runner(context);

  runner.apply(...plugins);

  return runner;
}

module.exports = kodiak;
