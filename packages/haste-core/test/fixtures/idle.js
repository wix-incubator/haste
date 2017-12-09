const sleep = time => new Promise(resolve => setTimeout(resolve, time));

module.exports = async () => {
  console.log('idle');

  await sleep(100); // prevent flakiness and having to use retry-promise

  return {
    log: async () => {
      console.log('log');
    },
    successful: async () => {
      return 'successful';
    },
    unsuccessful: async () => {
      throw new Error('unsuccessful');
    },
    options: async (...args) => {
      console.log(...args);
    },
  };
};
