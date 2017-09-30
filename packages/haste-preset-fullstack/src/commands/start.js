const path = require('path');
const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, watch, define } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const read = define('read');
  const write = define('write');
  const babel = define('babel');
  const clean = define('clean');
  const webpackDevServer = define('webpack-dev-server');
  const server = define('server');
  const mocha = define('mocha');

  await run(
    read('test/**/*.spec.js'),
    mocha()
  );

  watch('{src,test}/**/*.spec.js', changed => run(
    read(changed),
    mocha()
  ));

  // await run(
  //   clean(`${paths.build}/*`)
  // );

  // await Promise.all([
  //   run(
  //     read(`${paths.assets}/**/*.*`),
  //     write(paths.build)
  //   ),

  //   run(
  //     read(`${paths.src}/**/*.js`),
  //     babel(),
  //     write(paths.build)
  //   ),

  //   run(
  //     webpackDevServer({ configPath: paths.config.webpack.development })
  //   ),
  // ]);

  // await run(
  //   server({ serverPath: path.resolve(process.cwd(), 'dist/src/server.js') })
  // );

  // watch(paths.src, async (changed) => {
  //   await run(
  //     read(changed),
  //     babel(),
  //     write(paths.build),
  //     server({ serverPath: path.resolve(process.cwd(), 'dist/src/server.js') })
  //   );
  // });

  // watch(paths.assets, async (changed) => {
  //   await run(
  //     read(changed),
  //     write(paths.build)
  //   );
  // });

  return {
    persistent: true,
  };
};
