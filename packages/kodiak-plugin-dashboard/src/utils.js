module.exports.format = time => time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');

module.exports.delta = (start) => {
  const end = new Date();
  const time = end.getTime() - start.getTime();

  return [end, time];
};
