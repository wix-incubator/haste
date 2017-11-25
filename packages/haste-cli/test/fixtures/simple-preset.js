module.exports.passing = async () => {
  console.log('passing action');
  return { persistent: false };
};

module.exports.failing = async () => {
  throw new Error('failing action');
};
