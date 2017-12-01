const fs = require('fs');
const path = require('path');
const { setup } = require('haste-test-utils');

const taskPath = require.resolve('../src');

describe('haste-copy', () => {
  it('should copy files into target directory using absolute target path', async () => {
    const { run, files, cwd } = await setup({
      'test.txt': 'hello world'
    });

    await run(async ({ [taskPath]: copy }) => {
      await copy({
        pattern: '*.txt',
        target: path.join(cwd, 'dist'),
      });
    });

    expect(files['dist/test.txt'].content).toEqual('hello world');
  });

  it('should copy files into target directory using relative target path', async () => {
    const { run, files } = await setup({
      'test.txt': 'hello world'
    });

    await run(async ({ [taskPath]: copy }) => {
      await copy({
        pattern: '*.txt',
        target: 'dist',
      });
    });

    expect(files['dist/test.txt'].content).toEqual('hello world');
  });

  it('should copy binary files', async () => {
    const filepath = path.join(__dirname, './fixtures', 'logo.png');
    const content = fs.readFileSync(filepath, 'utf8');

    const { run, files } = await setup({
      'logo.png': content
    });

    await run(async ({ [taskPath]: copy }) => {
      await copy({
        pattern: '*.png',
        target: 'dist',
      });
    });

    expect(files['dist/logo.png'].content).toEqual(content);
  });

  it('should copy a file and create the directory structure if it does not exist', async () => {
    const { run, files } = await setup({
      'folder/structure/test.txt': 'hello world'
    });

    await run(async ({ [taskPath]: copy }) => {
      await copy({
        pattern: '**/*.txt',
        target: 'dist',
      });
    });

    expect(files['dist/folder/structure/test.txt'].content).toEqual('hello world');
  });
});
