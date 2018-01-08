module.exports = class Farm {
  constructor({ maxConcurrentCalls }) {
    this.pendingCalls = [];
    this.ongoingCalls = [];

    this.maxConcurrentCalls = maxConcurrentCalls;
  }

  request(call) {
    return new Promise((resolve, reject) => {
      this.pendingCalls.push({ call, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.pendingCalls.length === 0) {
      return null;
    }

    if (this.maxConcurrentCalls <= this.ongoingCalls.length) {
      return null;
    }

    const { call, resolve, reject } = this.pendingCalls.shift();
    this.ongoingCalls.push(call);

    try {
      await call().then(resolve, reject);
    } finally {
      this.ongoingCalls.splice(this.ongoingCalls.indexOf(call), 1);
      this.processQueue();
    }
  }
};
