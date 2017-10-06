module.exports = () => () => {
  console.log('returned-value-task');
  return Promise.resolve('some-value');
};
