// const LoggerPlugin = require('haste-plugin-logger');
// const paths = require('../../config/paths');

// module.exports = async (configure) => {
//   const { run, watch, clean, babel, read, copy } = configure({
//     plugins: [
//       new LoggerPlugin(),
//     ],
//   });

//   await run(
//     read([paths.build, paths.target]),
//     clean(),
//   );

//   await Promise.all([
//     run(
//       read([paths.styles]),
//       sass({ options }),
//       write(paths.build),
//     ),
//     run(
//       read([paths.assets]),
//       copy(paths.build),
//     ),
//     run(
//       read([paths.javascripts]),
//       babel({ options }),
//       write(paths.build),
//     ),
//     run(
//       webpackDevServer({ configPath: paths.config.webpack.development }),
//     ),
//   ]);

//   const restart = await run(
//     server({ file })
//   );

//   watch(paths.javascripts, async (changed) => {
//     await run(
//       read([changed]),
//       babel({ options }),
//       write(paths.build),
//     );
//   });

//   watch(paths.styles, async (changed) => {
//     await sass({ pattern: changed, output: paths.build });
//   });

//   watch(paths.assets, async (changed) => {
//     await run('copy', { pattern: changed, output: paths.build });
//   });

//   return {
//     persistent: true,
//   };
// };
