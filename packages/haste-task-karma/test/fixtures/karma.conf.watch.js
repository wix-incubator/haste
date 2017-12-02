module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    files: [
      require.resolve('./specs/pass'),
    ],
    browsers: ['PhantomJS'],
    singleRun: false,
    autoWatch: true,
    plugins: [
      require('karma-jasmine'), // eslint-disable-line import/no-extraneous-dependencies
      require('karma-phantomjs-launcher'), // eslint-disable-line import/no-extraneous-dependencies
    ],
  });
};
