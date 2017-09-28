module.exports = () => {
  console.log('unsuccessful-task');
  return Promise.reject('some-error');
};
