const { create } = require('kodiak-core');

const loggerMiddleware = next => (definition) => {
  const run = next(definition);

  ['stdout', 'stderr']
    .forEach(key => run.child[key].pipe(process[key]));

  return (options) => {
    console.log(`starting ${definition.name}`);

    return run(options)
      .then((result) => {
        console.log(`finished ${definition.name}`);
        return result;
      })
      .catch((error) => {
        console.log(`failed ${definition.name}`);
        throw error;
      });
  };
};

const { define, watch } = create([loggerMiddleware], __dirname);

const paths = {
  build: 'dist',
  javascripts: 'src/**/*.js',
};

module.exports.build = async () => {
  const babel = define({ name: 'babel' });

  await babel({ pattern: paths.javascripts, output: paths.build });

  watch(paths.javascripts, async (changed) => {
    await babel({ pattern: changed, output: paths.build });
  });

  return {
    persistent: true,
  };
};
