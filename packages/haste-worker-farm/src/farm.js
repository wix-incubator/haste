module.exports = class Farm {
  constructor({ maxConcurrentCalls }) {
    this.pendingCalls = [];
    this.ongoingCalls = [];

    this.maxConcurrentCalls = maxConcurrentCalls;
  }

  request(call) {
    this.pendingCalls.push(call);
    this.processQueue();
  }

  async processQueue() {
    if (this.pendingCalls.length === 0) {
      return null;
    }

    if (this.maxConcurrentCalls <= this.ongoingCalls.length) {
      return null;
    }

    const call = this.pendingCalls.shift();
    this.ongoingCalls.push(call);

    try {
      await call();
    } finally {
      this.ongoingCalls.splice(this.ongoingCalls.indexOf(call), 1);
      this.processQueue();
    }
  }
};
