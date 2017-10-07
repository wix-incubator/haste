module.exports = () => () => {
  console.log('no-error-task');
  return Promise.reject();
};
