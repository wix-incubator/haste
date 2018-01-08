const fs = require('fs');
const http = require('http');

const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

const validConfigPath = require.resolve('./fixtures/webpack.config');
const invalidConfigPath = require.resolve('./fixtures/webpack.invalid');
const decoratorPath = require.resolve('./fixtures/decorator');
const callbackPath = require.resolve('./fixtures/callback');

const fileContent = fs.readFileSync(require.resolve('./fixtures/entry'), 'utf8');

const request = url => new Promise((resolve, reject) => {
  const req = http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => resolve({ data, res }));
  });

  req.on('error', reject);
});

describe('haste-webpack-dev-server', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should run an http server and serve webpack assets', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: webpackDevServer }) => {
      await webpackDevServer({
        configPath: validConfigPath,
      });
    });

    const { data } = await request('http://127.0.0.1:9200/bundle.js');

    expect(data).toMatch(fileContent);
  });

  it('should allow configuring port and hostname', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: webpackDevServer }) => {
      await webpackDevServer({
        configPath: validConfigPath,
        hostname: '127.0.0.1',
        port: 3000,
      });
    });

    const { data } = await request('http://127.0.0.1:3000/bundle.js');

    expect(data).toMatch(fileContent);
  });

  it('should return 404 for assets that don\'t exist', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: webpackDevServer }) => {
      await webpackDevServer({
        configPath: validConfigPath,
      });
    });

    const { res } = await request('http://127.0.0.1:9200/404.js');

    expect(res.statusCode).toEqual(404);
  });

  it('should fail for invalid webpack configurations', async () => {
    expect.assertions(1);

    test = await setup();

    await test.run(async ({ [taskPath]: webpackDevServer }) => {
      try {
        await webpackDevServer({
          configPath: invalidConfigPath,
        });
      } catch (error) {
        expect(error.message).toMatch('Invalid configuration object');
      }
    });
  });

  it('should support passing a decorator that accepts the express app', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: webpackDevServer }) => {
      await webpackDevServer({
        configPath: validConfigPath,
        decoratorPath,
      });
    });

    const { data } = await request('http://127.0.0.1:9200/foo');

    expect(data).toMatch('bar');
  });

  it('should support passing a callback that accepts the webpack compiler', async () => {
    test = await setup();

    await test.run(async ({ [taskPath]: webpackDevServer }) => {
      await webpackDevServer({
        configPath: validConfigPath,
        callbackPath,
      });
    });

    await request('http://127.0.0.1:9200/bundle.js');

    expect(test.stdio.stdout).toMatch('1 module');
  });
});
