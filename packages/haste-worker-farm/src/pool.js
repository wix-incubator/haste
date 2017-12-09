const mergeStream = require('merge-stream');
const Worker = require('./worker');
const { reduceObj } = require('./utils');

module.exports = class Pool {
  constructor({ farm, modulePath, workerOptions }) {
    this.workers = [];
    this.workerOptions = workerOptions;

    this.farm = farm;
    this.modulePath = modulePath;
    this.ending = false;

    this.stdout = mergeStream();
    this.stderr = mergeStream();
  }

  forkWorker() {
    const worker = new Worker({
      modulePath: this.modulePath,
      workerOptions: this.workerOptions,
    });

    this.stdout.add(worker.child.stdout);
    this.stderr.add(worker.child.stderr);

    this.workers.push(worker);

    return worker;
  }

  resolveWorker() {
    return this.workers.find((worker) => {
      return worker.busy === false && worker.idle === false;
    });
  }

  async send({ options }) {
    if (this.ending) {
      throw new Error('Farm has ended, no more calls can be done to it');
    }

    return this.farm.request(async () => {
      const worker = this.resolveWorker() || this.forkWorker();
      const result = await worker.send({ options });

      const wrap = f => (...args) => this.farm.request(() => f(...args));

      if (worker.idle) {
        return reduceObj(result, (obj, key) => {
          return { ...obj, [key]: wrap(result[key]) };
        });
      }

      return result;
    });
  }

  kill() {
    if (!this.ending) {
      this.ending = true;
      this.workers.forEach(worker => worker.kill());
    }
  }
};
