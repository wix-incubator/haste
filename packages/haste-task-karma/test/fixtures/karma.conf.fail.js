module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    files: [
      require.resolve('./specs/fail')
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    plugins: [
      require('karma-jasmine'), // eslint-disable-line import/no-extraneous-dependencies
      require('karma-phantomjs-launcher'), // eslint-disable-line import/no-extraneous-dependencies
    ],
  });
};
