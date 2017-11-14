module.exports = class Pool {
  constructor({ farm, modulePath }) {
    this.farm = farm;
    this.modulePath = modulePath;
  }

  call({ options }) {
    return new Promise((resolve, reject) => {
      this.farm.callQueue.push({ pool: this, options, resolve, reject });
      this.farm.processQueue();
    });
  }
};
