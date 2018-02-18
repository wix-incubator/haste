module.exports = ({ entry }) => ({
  input: entry,

  output: {
    format: 'umd',
    file: 'bundle.js',
  },
});
