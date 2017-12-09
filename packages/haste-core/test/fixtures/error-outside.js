setTimeout(() => {
  throw new Error('unsuccessful');
}, 1000);

module.exports = () => new Promise(() => {});
