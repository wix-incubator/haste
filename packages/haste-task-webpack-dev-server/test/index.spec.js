const fs = require('fs');
const http = require('http');
const { run } = require('haste-test-utils');

const configPath = require.resolve('./fixtures/webpack.config');
const { command: webpackDevServer, kill } = run(require.resolve('../src'));

const fileContent = fs.readFileSync(require.resolve('./fixtures/entry')).toString();

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
  afterEach(kill);

  it('should run an http server and serve webpack assets', () => {
    const { task } = webpackDevServer({ configPath });

    return task()
      .then(async () => {
        const { data } = await request('http://127.0.0.1:9200/bundle.js');
        expect(data).toMatch(fileContent);
      });
  });

  it('should allow configuring port and hostname', () => {
    const port = 3000;
    const hostname = 'localhost';

    const { task } = webpackDevServer({
      configPath,
      port,
      hostname,
    });

    return task()
      .then(async () => {
        const { data } = await request(`http://${hostname}:${port}/bundle.js`);
        expect(data).toMatch(fileContent);
      });
  });

  it('should return 404 for assets that don\'t exist', () => {
    const { task } = webpackDevServer({ configPath });

    return task()
      .then(async () => {
        const { res } = await request('http://127.0.0.1:9200/404.js');
        expect(res.statusCode).toEqual(404);
      });
  });

  it('should fail for invalid webpack configurations', () => {
    expect.assertions(1);

    const { task } = webpackDevServer({
      configPath: require.resolve('./fixtures/webpack.invalid'),
    });

    return task()
      .catch((error) => {
        expect(error.message).toMatch(/Invalid configuration object/);
      });
  });
});
