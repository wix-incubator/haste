const { fork } = require('child_process');
const uuid = require('uuid/v4');
const { parseError } = require('./utils');

const WORKER_BIN = require.resolve('./worker-bin');

const WORKER_OPTIONS = {
  silent: true,
  env: {
    FORCE_COLOR: true,
    ...process.env,
  },
};

module.exports = class Worker {
  constructor({ workerOptions, modulePath }) {
    this.workerOptions = workerOptions;
    this.modulePath = modulePath;

    this.busy = false;
    this.idle = false;

    this.promise = null;
    this.calls = {};

    this.initialize();
  }

  initialize() {
    this.child = fork(WORKER_BIN, { ...WORKER_OPTIONS, ...this.workerOptions });

    this.child.on('message', (...args) => this.receive(...args));

    this.child.send({
      type: 'CHILD_MESSAGE_INITIALIZE',
      options: {
        modulePath: this.modulePath,
      },
    });
  }

  send({ options }) {
    if (this.busy) {
      throw new Error('Unexpected request to a busy worker');
    }

    this.busy = true;

    return new Promise((resolve, reject) => {
      this.promise = { resolve, reject };
      this.child.send({ type: 'CHILD_MESSAGE_CALL', options });
    });
  }

  createApiCall(key) {
    return (...args) => new Promise((resolve, reject) => {
      const callId = uuid();

      this.calls[callId] = { resolve, reject };

      this.child.send({
        type: 'CHILD_MESSAGE_API',
        options: {
          name: key,
          callId,
          args,
        },
      });
    });
  }

  createApi(keys) {
    const api = keys.reduce((obj, key) => {
      return { ...obj, [key]: this.createApiCall(key) };
    }, {});

    return api;
  }

  receive({ type, result, error, options }) {
    switch (type) {
      case 'PARENT_MESSAGE_COMPLETE':
        this.busy = false;
        this.promise.resolve();
        break;

      case 'PARENT_MESSAGE_IDLE':
        this.idle = true;
        this.api = this.createApi(result);
        this.promise.resolve(this.api);
        break;

      case 'PARENT_MESSAGE_ERROR':
        this.busy = false;
        this.promise.reject(parseError(error));
        break;

      case 'PARENT_MESSAGE_API':
        error ?
          this.calls[options.callId].reject(error) :
          this.calls[options.callId].resolve(result);
        break;

      default:
        throw new Error('Unexpected response from worker');
    }
  }

  kill() {
    this.child.send({ type: 'CHILD_MESSAGE_KILL' });
  }
};
