module.exports.config = {
  specs: ['specs/pass.js'],
  capabilities: {
    browserName: 'chrome',

    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--window-size=800,600'],
    },
  },
};
