module.exports.delta = (start, end) => {
  return Math.abs(end.getTime() - start.getTime());
};

module.exports.parseFileNamePattern = (pattern, name) => {
  return `${pattern.replace('[name]', name)}.json`;
};
