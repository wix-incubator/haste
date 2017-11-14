const { fork } = require('child_process');
const { PARENT_MESSAGE_OK, PARENT_MESSAGE_ERROR, CHILD_MESSAGE_CALL } = require('./constants');

const WORKER_BIN = require.resolve('./worker-bin');
const WORKER_OPTIONS = {
  silent: false,
  env: {
    FORCE_COLOR: true,
    ...process.env
  }
};

module.exports = class Worker {
  constructor({ pool }) {
    this.pool = pool;
    this.busy = false;
    this.child = fork(WORKER_BIN, [pool.modulePath], WORKER_OPTIONS);

    this.child.on('message', (...args) => this.receive(...args));
  }

  send({ options }) {
    if (this.busy) {
      throw new Error('Worker is busy');
    }

    this.busy = true;

    return new Promise((resolve, reject) => {
      this.lastCall = { resolve, reject };
      this.child.send({ type: CHILD_MESSAGE_CALL, options });
    });
  }

  receive({ type, result, error }) {
    this.busy = false;

    switch (type) {
      case PARENT_MESSAGE_OK:
        this.lastCall.resolve(result);
        break;

      case PARENT_MESSAGE_ERROR:
        this.lastCall.reject(error);
        break;

      default:
        throw new Error('Unexpected response from worker');
    }
  }
};
