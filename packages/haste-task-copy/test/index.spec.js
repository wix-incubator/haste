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

  it('should copy files inside of "source" option into target directory when source is relative to cwd', async () => {
    test = await setup({
      'folder/structure/test.txt': 'hello world',
    });

    await test.run(async ({ [taskPath]: copy }) => {
      await copy({
        pattern: '**/*.txt',
        source: 'folder',
        target: 'dist',
      });
    });

    expect(test.files['dist/structure/test.txt'].content).toEqual('hello world');
  });

  it('should copy files inside of "source" option into target directory when source is absolute', async () => {
    test = await setup({
      'folder/structure/test.txt': 'hello world',
    });

    const absoluteSource = path.join(test.cwd, 'folder');

    await test.run(async ({ [taskPath]: copy }) => {
      await copy({
        pattern: '**/*.txt',
        source: absoluteSource,
        target: 'dist',
      });
    });

    expect(test.files['dist/structure/test.txt'].content).toEqual('hello world');
  });
});
