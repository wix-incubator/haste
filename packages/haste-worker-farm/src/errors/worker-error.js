module.exports = class extends Error {
  constructor(error) {
    super();

    this.error = error;
    this.name = 'WorkerError';
    this.message = error ? `Error in worker: ${error.stack}` : 'Unknown error in worker';
  }
};
