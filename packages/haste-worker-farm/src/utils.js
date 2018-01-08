const WorkerError = require('./errors/worker-error');

module.exports.parseError = (errorObj) => {
  const error = Object.getOwnPropertyNames(errorObj).reduce((obj, key) => {
    return Object.assign(obj, { [key]: errorObj[key] });
  });

  return new WorkerError(error);
};

module.exports.reduceObj = (obj, callback, initialValue = {}) => {
  return Object.keys(obj).reduce(callback, initialValue);
};
