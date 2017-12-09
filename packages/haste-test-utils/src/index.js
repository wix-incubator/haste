const { createRunner } = require('haste-core');
const TestPlugin = require('./test-plugin');
const fsSetup = require('./fs-setup');

module.exports.setup = async (fsObject) => {
  const { cwd, files } = await fsSetup(fsObject);
  const testPlugin = new TestPlugin();

  const run = async (action, options = {}) => {
    const runner = createRunner({ plugins: [testPlugin] });
    await runner.command(action)({ workerOptions: { cwd }, ...options });
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
    },
  });

  return { run, files, stdio, cwd, cleanup };
};
