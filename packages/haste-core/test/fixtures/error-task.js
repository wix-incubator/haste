module.exports = () => () => {
  console.log('error-task');
  throw new Error('some-error');
};
