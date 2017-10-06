module.exports = options => () => {
  console.log('logging-options-task');
  console.log(options);
  return Promise.resolve('some-value');
};
