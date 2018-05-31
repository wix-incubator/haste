setTimeout(() => {
  Promise.reject(new Error('unsuccessful'));
}, 1000);

module.exports = () => new Promise(() => {});
