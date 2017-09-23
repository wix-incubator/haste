const path = require('path');
const { create } = require('kodiak-core');

const parallelMiddleware = next => (definition) => {
  const run = next(definition);

  return (options) => {
    if (Array.isArray(options)) {
      return Promise.all(options.map(run));
    }

    return run(options);
  };
};

const loggerMiddleware = next => (definition) => {
  const run = next(definition);

  ['stdout', 'stderr']
    .forEach(key => run.child[key].pipe(process[key]));

  return (options) => {
    console.log(`starting ${definition.name}...`);

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

const { define, watch } = create([loggerMiddleware, parallelMiddleware]);

module.exports.build = async () => {
  const babel = define({ name: require.resolve('kodiak-task-babel') });

  await babel([
    { patterns: [path.resolve(process.cwd(), 'src', '**/*.js')] },
    { patterns: [path.resolve(process.cwd(), 'src', '**/*.js')] },
  ]);

  watch(path.resolve(process.cwd(), 'src', '**/*.js'), async (changed) => {
    await babel({ patterns: [changed] });
  });

  return {
    persistent: true,
  };
};
