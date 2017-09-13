module.exports = () => {
  console.log('un-successful-task');
  return Promise.reject('some-error');
};
