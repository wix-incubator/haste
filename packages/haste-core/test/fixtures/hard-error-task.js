module.exports = () => () => {
  console.log('hard-error-task');
  throw new Error('some-error');
};
