module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    files: [
      require.resolve('./specs/pass')
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    plugins: [
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
    ],
  });
};
