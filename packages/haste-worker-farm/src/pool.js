const Worker = require('./worker');

module.exports = class Pool {
  constructor({ farm, modulePath }) {
    this.workers = [];

    this.farm = farm;
    this.modulePath = modulePath;
  }

  forkWorker() {
    const worker = new Worker({ modulePath: this.modulePath });
    this.workers.push(worker);

    return worker;
  }

  resolveWorker() {
    return this.workers.find(worker => worker.busy === false);
  }

  call({ options }) {
    return new Promise((resolve, reject) => {
      const call = () => {
        const worker = this.resolveWorker() || this.forkWorker();

        return worker.send({ options })
          .then(resolve, reject);
      };

      this.farm.request(call);
    });
  }
};
