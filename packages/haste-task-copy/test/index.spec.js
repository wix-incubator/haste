const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const mkdirp = require('mkdirp');
const copy = require('../src');

describe('haste-copy', () => {
  let projectDir;
  const target = 'statics';

  const copyToProject = (from, to) => {
    const dest = path.join(projectDir, to);
    mkdirp.sync(path.dirname(dest));
    fs.copyFileSync(require.resolve(from), dest);
  };

  beforeEach(() => {
    projectDir = tempy.directory();
  });

  it('should copy files into target directory using absolute target path', async () => {
    const filename = 'file.txt';
    const file = { filename };
    const source = require.resolve(`./fixtures/${filename}`);
    const absoluteTarget = path.join(projectDir, target);
    const sourceContent = fs.readFileSync(source, 'utf8');

    copyToProject(source, filename);

    const task = copy({ target: absoluteTarget, cwd: projectDir });

    await task([file]);

    const result = fs.readFileSync(path.join(projectDir, target, file.filename), 'utf8');

    expect(result).toEqual(sourceContent);
  });

  it('should copy files into target directory using relative target path', async () => {
    const filename = 'file.txt';
    const file = { filename };
    const source = require.resolve(`./fixtures/${filename}`);
    const sourceContent = fs.readFileSync(source, 'utf8');

    copyToProject(source, filename);

    const task = copy({ target, cwd: projectDir });

    await task([file]);

    const result = fs.readFileSync(path.join(projectDir, target, file.filename), 'utf8');

    expect(result).toEqual(sourceContent);
  });

  it('should copy a not serializable file', async () => {
    const filename = 'logo.png';
    const file = { filename };
    const source = require.resolve(`./fixtures/${filename}`);
    const sourceContent = fs.readFileSync(source, 'utf8');

    copyToProject(source, filename);

    const task = copy({ target, cwd: projectDir });

    await task([file]);

    const result = fs.readFileSync(path.join(projectDir, target, file.filename), 'utf8');

    expect(result).toEqual(sourceContent);
  });

  it('create a directory if specified in filename', async () => {
    const filename = './fixtures/logo.png';
    const file = { filename };
    const source = require.resolve(filename);
    const sourceContent = fs.readFileSync(source, 'utf8');

    copyToProject(source, filename);

    const task = copy({ target, cwd: projectDir });

    await task([file]);

    const result = fs.readFileSync(path.join(projectDir, target, file.filename), 'utf8');

    expect(result).toEqual(sourceContent);
  });

  it('should throw an error if source file is not exist', async () => {
    expect.assertions(1);

    const task = copy({ target, cwd: projectDir });
    const file = { filename: 'does/not/exists/file.txt' };

    try {
      await task([file]);
    } catch (error) {
      expect(error.code).toEqual('ENOENT');
    }
  });
});
