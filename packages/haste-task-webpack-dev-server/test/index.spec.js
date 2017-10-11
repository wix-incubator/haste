const r2 = require('r2');
const run = require('../../teskit');

const configPath = require.resolve('./fixtures/webpack.config');
const webpackDevServer = run(require.resolve('../src'));

const fileContent = 'console.log(\'hello world\');';

describe('haste-webpack-dev-server', () => {
  it('should run an http server and serve webpack assets', () => {
    const task = webpackDevServer({ configPath });

    return task()
      .then(async ({ kill }) => {
        const { text } = await r2('http://127.0.0.1:9200/bundle.js');
        expect(await text).toContain(fileContent);
        kill();
      });
  });

  it('should allow configuring port and hostname', () => {
    const port = 3000;
    const hostname = 'localhost';

    const task = webpackDevServer({
      configPath,
      port,
      hostname,
    });

    return task()
      .then(async ({ kill }) => {
        const { text } = await r2(`http://${hostname}:${port}/bundle.js`);
        expect(await text).toContain(fileContent);
        kill();
      });
  });

  it('should return 404 for assets that don\'t exist', () => {
    const task = webpackDevServer({ configPath });

    return task()
      .then(async ({ kill }) => {
        const { response } = await r2('http://127.0.0.1:9200/404.js');
        expect((await response).status).toEqual(404);
        kill();
      });
  });

  it('should fail for invalid webpack configurations', () => {
    expect.assertions(1);

    const task = webpackDevServer({
      configPath: require.resolve('./fixtures/webpack.invalid'),
    });

    return task()
      .catch(({ error }) => {
        expect(error.message).toMatch(/Invalid configuration object/);
      });
  });
});