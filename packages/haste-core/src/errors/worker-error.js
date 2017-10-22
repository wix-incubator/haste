module.exports = class extends Error {
  constructor(error) {
    super();

    this.name = 'WorkerError';
    this.message = `Error in worker: ${error.stack}`;
    this.error = error;
  }
};
