const mergeStream = require('merge-stream');
const Worker = require('./worker');

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
    return this.workers.find(worker => worker.busy === false);
  }

  async send({ options }) {
    if (this.ending) {
      throw new Error('Farm has ended, no more calls can be done to it');
    }

    return new Promise((resolve, reject) => {
      this.farm.request(() => {
        const worker = this.resolveWorker() || this.forkWorker();

        return worker.send({ options })
          .then(resolve, reject);
      });
    });
  }

  kill() {
    this.ending = true;
    this.workers.forEach(worker => worker.kill());
  }
};
