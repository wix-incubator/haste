module.exports = (compiler) => {
  compiler.plugin('done', stats => console.log(stats.toString('minimal')));
};
