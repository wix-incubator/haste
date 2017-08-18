const sleep = time => new Promise(resolve => setTimeout(resolve, time));

module.exports = async () => {
  await sleep(2000);
};
