const Pool = require('./pool');
const Worker = require('./worker');

module.exports = class Farm {
  constructor({ maxConcurrentCalls }) {
    this.workers = [];
    this.callQueue = [];
    this.activeWorkers = 0;

    this.maxConcurrentCalls = maxConcurrentCalls;
  }

  createPool({ name, context }) {
    return new Pool({ farm: this, name, context });
  }

  findIdleWorker({ pool }) {
    return this.workers
      .filter(worker => worker.pool === pool)
      .find(worker => worker.busy === false);
  }

  forkWorker({ pool }) {
    const worker = new Worker({ pool });
    this.workers.push(worker);

    return worker;
  }

  resolveWorker({ pool }) {
    return this.findIdleWorker({ pool }) || this.forkWorker({ pool });
  }

  async processQueue() {
    if (this.callQueue.length > 0) {
      if (this.maxConcurrentCalls > this.activeWorkers) {
        const { pool, options, resolve, reject } = this.callQueue.shift();
        const worker = this.resolveWorker({ pool });

        try {
          this.activeWorkers += 1;
          const result = await worker.send({ options });
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeWorkers -= 1;
          this.processQueue();
        }
      }
    }
  }
};
