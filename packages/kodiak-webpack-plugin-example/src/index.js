module.exports = config => Object.assign(config, {
  module: {
    rules: [
      {
        test: /\.txt$/,
        loader: require.resolve('raw-loader'),
      }
    ]
  }
});
