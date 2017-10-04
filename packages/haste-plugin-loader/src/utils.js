module.exports.delta = (start) => {
  const end = new Date();
  const time = end.getTime() - start.getTime();

  return [end, time];
};
