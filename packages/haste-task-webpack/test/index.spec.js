const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const { run } = require('haste-test-utils');
const webpack = require('../src');
const config = require('./fixtures/webpack.config');

const configPath = require.resolve('./fixtures/webpack.config');
const configFunctionPath = require.resolve('./fixtures/webpack.config.function');
const callbackPath = require.resolve('./fixtures/callback');

describe('haste-webpack', () => {
  it('should bundle with webpack', async () => {
    const task = webpack({ configPath });

    await task();

    const bundlePath = path.join(config.output.path, config.output.filename);
    expect(fs.existsSync(bundlePath)).toEqual(true);
  });

  it('should reject if webpack fails', async () => {
    expect.assertions(1);

    const task = webpack({
      configPath: require.resolve('./fixtures/webpack.config.invalid'),
    });
    try {
      await task();
    } catch (error) {
      expect(error.message).toMatch(/Invalid configuration object/);
    }
  });

  describe('when configPath is a path to a function', () => {
    it('should pass parameters argument to the function', async () => {
      const configParams = {
        entry: require.resolve('./fixtures/entry.js'),
        output: {
          path: tempy.directory(),
          filename: 'bundle.js'
        }
      };

      const task = webpack({ configPath: configFunctionPath, configParams });

      await task();

      const bundlePath = path.join(configParams.output.path, configParams.output.filename);
      expect(fs.existsSync(bundlePath)).toEqual(true);
    });
  });

  it('should support passing callback that accepts webpack err and stats', async () => {
    const { command, kill } = run(require.resolve('../src'));
    const { task, stdout } = command({ configPath, callbackPath });

    try {
      await task();
      expect(stdout()).toMatch('1 module');
    } finally {
      kill();
    }
  });

  it('should reject if there are compilation erros', async () => {
    expect.assertions(1);

    const task = webpack({
      configPath: require.resolve('./fixtures/webpack.config.error'),
    });

    try {
      await task();
    } catch (error) {
      expect(error).toMatch('Module not found');
    }
  });
});
