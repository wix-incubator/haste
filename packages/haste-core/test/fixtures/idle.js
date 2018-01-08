module.exports = async () => {
  console.log('idle');

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
