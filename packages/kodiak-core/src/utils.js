module.exports.asyncToCallback = f => (data, callback) => f(data)
  .then(result => callback(null, result))
  .catch(error => callback(error));
