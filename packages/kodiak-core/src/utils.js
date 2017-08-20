module.exports.format = time => time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');

module.exports.delta = (start) => {
  const end = new Date();
  const time = end.getTime() - start.getTime();

  return [end, time];
};

module.exports.asyncToCallback = f => (data, callback) => f(data)
  .then(result => callback(null, result))
  .catch(error => callback(error));
