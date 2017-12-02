const fs = require('fs');
const path = require('path');
const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

describe('haste-copy', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should copy files into target directory using absolute target path', async () => {
    test = await setup({
      'test.txt': 'hello world',
    });

    await test.run(async ({ [taskPath]: copy }) => {
      await copy({
        pattern: '*.txt',
        target: path.join(test.cwd, 'dist'),
      });
    });

    expect(test.files['dist/test.txt'].content).toEqual('hello world');
  });

  it('should copy files into target directory using relative target path', async () => {
    test = await setup({
      'test.txt': 'hello world',
    });

    await test.run(async ({ [taskPath]: copy }) => {
      await copy({
        pattern: '*.txt',
        target: 'dist',
      });
    });

    expect(test.files['dist/test.txt'].content).toEqual('hello world');
  });

  it('should copy binary files', async () => {
    const filepath = path.join(__dirname, './fixtures', 'logo.png');
    const content = fs.readFileSync(filepath, 'utf8');

    test = await setup({
      'logo.png': content,
    });

    await test.run(async ({ [taskPath]: copy }) => {
      await copy({
        pattern: '*.png',
        target: 'dist',
      });
    });

    expect(test.files['dist/logo.png'].content).toEqual(content);
  });

  it('should copy a file and create the directory structure if it does not exist', async () => {
    test = await setup({
      'folder/structure/test.txt': 'hello world',
    });

    await test.run(async ({ [taskPath]: copy }) => {
      await copy({
        pattern: '**/*.txt',
        target: 'dist',
      });
    });

    expect(test.files['dist/folder/structure/test.txt'].content).toEqual('hello world');
  });
});
