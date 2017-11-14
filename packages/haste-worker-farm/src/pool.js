module.exports = class Pool {
  constructor({ farm, name, context }) {
    this.farm = farm;
    this.name = name;
    this.context = context;
  }

  call({ options }) {
    return new Promise((resolve, reject) => {
      this.farm.callQueue.push({ pool: this, options, resolve, reject });
      this.farm.processQueue();
    });
  }
};
