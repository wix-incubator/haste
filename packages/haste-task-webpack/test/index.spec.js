const fs = require('fs');
const path = require('path');
const webpack = require('../src');
const config = require('./fixtures/webpack.config');

const configPath = require.resolve('./fixtures/webpack.config');

describe('haste-webpack', () => {
  it('should bundle with webpack', async () => {
    const task = webpack({ configPath });

    return task()
      .then(() => {
        const bundlePath = path.join(config.output.path, config.output.filename);
        expect(fs.existsSync(bundlePath)).toEqual(true);
      });
  });

  it('should reject if webpack fails', async () => {
    expect.assertions(1);

    const task = webpack({
      configPath: require.resolve('./fixtures/webpack.invalid'),
    });

    return task()
      .catch((error) => {
        expect(error.message).toMatch(/Invalid configuration object/);
      });
  });
});
