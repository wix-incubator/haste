const { create } = require('haste-core');
const TestPlugin = require('./test-plugin');
const fsSetup = require('./fs-setup');

module.exports.setup = async (fsObject) => {
  const { cwd, files } = await fsSetup(fsObject);
  const testPlugin = new TestPlugin();

  const run = async (action) => {
    const { define } = create({ plugins: [testPlugin] });
    await define(action)({ workerOptions: { cwd } });
  };

  const cleanup = () => testPlugin.cleanup();

  const stdio = new Proxy({}, {
    get: (target, prop) => {
      switch (prop) {
        case 'stdout': {
          return testPlugin.stdout;
        }
        case 'stderr': {
          return testPlugin.stderr;
        }
        default: {
          return undefined;
        }
      }
    }
  });

  return { run, files, stdio, cwd, cleanup };
};
