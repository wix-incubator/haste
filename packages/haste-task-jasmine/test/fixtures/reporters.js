const customReporter = {
  jasmineStarted(suiteInfo) {
    console.log(`running suite with ${suiteInfo.totalSpecsDefined}`);
  }
};

module.exports = [
  customReporter
];
