const Runner = require('./runner');

function kodiak(...args) {
  return new Runner(...args);
}

module.exports = kodiak;
