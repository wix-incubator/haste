const http = require('http');
const { run } = require('haste-test-utils');

const callbackPath = require.resolve('./fixtures/callback');
const responseText = 'hello world';

const { command: express, kill } = run(require.resolve('../src'));

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

describe('haste-express', () => {
  afterEach(kill);

  it('should run an http server', () => {
    const { task } = express({ callbackPath });

    return task()
      .then(async () => {
        const { data } = await request('http://127.0.0.1:9200');
        expect(data).toMatch(responseText);
      });
  });

  it('should allow configuring port and hostname', () => {
    const port = 3000;
    const hostname = 'localhost';

    const { task } = express({
      callbackPath,
      port,
      hostname,
    });

    return task()
      .then(async () => {
        const { data } = await request(`http://${hostname}:${port}`);
        expect(data).toMatch(responseText);
      });
  });
});
