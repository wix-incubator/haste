module.exports = () => (value) => {
  console.log('logging-value-task');
  console.log(value);
  return Promise.resolve('some-other-value');
};
